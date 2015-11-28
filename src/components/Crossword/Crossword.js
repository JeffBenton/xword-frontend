let React = require('react');
let CrosswordBoard = require('./../Crossword/CrosswordBoard.js');
let CrosswordClues = require('./../Crossword/CrosswordClues.js');


class Box {

    constructor(id, version, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.value = null;
        //this.isCorrect = false;
        this.isBlackBox = false;
        this.isSelected = false;
        this.version = version;
        this.across = null;
        this.down = null;
    }
}

class Clue {

    constructor(direction, number) {
        this.direction = direction;
        this.number = number;
        this.text = "";
        this.isSelected = false;
    }
}

class Crossword extends React.Component {

    constructor(props) {
        super(props);

        var board = [];
        // initiate the board state
        for (let i = 0; i < props.height; i++) {
            board[i] = [];
            for (let j = 0; j < props.width; j++) {
                board[i][j] = new Box((i*props.height) + j, 0, j, i);
            }
        }
        var puzzle = this.createPuzzleFromBoard(board, 0);
        var clues = this.createCluesFromPuzzle(puzzle);
        this.state = {
            version: 0,
            board: board,
            puzzle: puzzle,
            clues: clues,
            selected: null
        };

        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }

    createCluesFromPuzzle(puzzle) {
        var clues = {};
        for (var direction in puzzle) {
            clues[direction] = {};
            for (var number in puzzle[direction]) {
                clues[direction][number] = new Clue(direction,number);
                clues[direction][number].text = direction + ' ' + number;
            }
        }
        return clues;
    }

    updateCluesFromClickEvent(box) {
        var clues = {
            down: {},
            across: {}
        };
        if (box.isBlackBox) {
            var createdAcrossClue;
            var createdDownClue;
            var lostDownClue;
            var lostAcrossClue;
            // if we turned this box into a black box, we've potentially added clues to the state.
            // look left
            if (this.state.board[box.y].length > box.x + 1 && this.state.board[box.y][box.x+1].across != null) {
                console.log('created clue: ' + this.state.board[box.y][box.x+1].across.clue + ' across');
                createdAcrossClue = this.state.board[box.y][box.x+1].across.clue;
            }
            // look down
            if (this.state.board.length > box.y + 1 && this.state.board[box.y +1][box.x].down != null) {
                console.log('created clue: ' + this.state.board[box.y+1][box.x].down.clue + ' down');
                createdDownClue = this.state.board[box.y+1][box.x].down.clue;
            }
            // look up
            if (box.y === 0 || this.state.board[box.y-1][box.x].isBlackBox) {
                lostDownClue = this.determineLostDownClue(box);
                console.log('lost a down clue: ' + lostDownClue + ' down');
            }
            // look right
            if (box.x + 1 < this.state.board[box.y].length &&
                    box.x - 1 > 0 && this.state.board[box.y][box.x-1].across == null &&
                    !this.state.board[box.y][box.x+1].isBlackBox &&
                    this.state.board[box.y][box.x+1].across == null) {
                lostAcrossClue = this.determineLostAcrossClue(box);
                console.log('lost an across clue: ' + lostAcrossClue);
            }

            if (createdDownClue && lostDownClue) {
                clues.down[createdDownClue] = this.state.clues.down[lostDownClue];
                clues.down[createdDownClue].number = createdDownClue;
            } else if (createdDownClue) {
                clues.down[createdDownClue] = new Clue('down',createdDownClue);
            }

            if (createdAcrossClue) {
                clues.across[createdAcrossClue] = new Clue('across', createdAcrossClue);
            }

            for (var number in this.state.clues.down) {
                var offset = number;
                if (offset >= createdDownClue) {
                    offset++;
                }
                if (offset == lostDownClue) {
                    continue;
                } else if (offset > lostDownClue) {
                    offset--;
                }
                clues['down'][offset] = this.state.clues.down[number];
                clues['down'][offset].number = offset;
            }

            for (var number in this.state.clues.across) {
                var offset = number;
                if (offset >= createdAcrossClue && (this.state.clues.down[createdAcrossClue] == null || createdAcrossClue == lostDownClue)) {
                    offset++;
                }
                if (offset >= createdDownClue) {
                    offset++;
                }
                if (offset >= lostDownClue) {
                    offset--;
                }
                if (offset == lostAcrossClue) {
                    continue;
                } else if (offset > lostAcrossClue) {
                    offset--;
                }
                clues['across'][offset] = this.state.clues.across[number];
                clues['across'][offset].number = offset;
            }

        }
        console.log(clues);
        return clues;
    }

    determineLostAcrossClue(box) {
        for (let i = 1; box.x + i < this.state.board[box.y].length || box.x - i >= 0; i++) {
            if (box.x + i < this.state.board[box.y].length) {
                let b = this.state.board[box.y][box.x+i];
                if (b.across != null) {
                    return b.across.clue;
                }
            }
            if (box.x - i >= 0 && !this.state.board[box.y][box.x - i].down != null) {
                let b = this.state.board[box.y][box.x - i];
                if (b.across != null && b.across) {
                    return b.across.clue + 1;
                }
            }
        }
    }
    determineLostDownClue(box) {
        for (let i = 1; box.x + i < this.state.board[box.y].length || box.x - i >= 0; i++) {
            if (box.x + i < this.state.board[box.y].length) {
                let b = this.state.board[box.y][box.x+i];
                if (b.across != null && b.across.char === 0) {
                    return b.across.clue;
                }
                if (b.down != null && b.down.char === 0) {
                    return b.down.clue;
                }
            }
            if (box.x - i >= 0 && !this.state.board[box.y][box.x - i].down != null) {
                let b = this.state.board[box.y][box.x-i];
                if (b.across != null && b.across.char === 0) {
                    return b.across.clue + 1;
                }
                if (b.down != null && b.down.char === 0) {
                    return b.down.clue + 1;
                }
            }
        }
    }

    createPuzzleFromBoard(board, version) {
        var puzzle = {
            across: {},
            down: {}
        };
        var clueCount = 1;

        var finishAcrossClue = function(acrossClue, acrossClueCount) {
            if (acrossClue.length > 1) {
                puzzle.across[acrossClueCount] = acrossClue;
                clueCount++;
            }
        };

        var shouldMakeDownClue = function(x, y) {
            let box = board[y][x];
            return (box.down == null && board.length > y+1 && !(board[y+1][x].isBlackBox));
        };

        var makeDownClue = function(x, y) {
            let downClue = [];
            let start = board[y][x];
            let isNewClue = (start.across == null || start.across.char != 0);
            let downClueNumber = isNewClue ? (start.across == null) ?  clueCount : clueCount + 1 : start.across.clue;

            for (let i = y; i < board.length; i++) {
                let box = board[i][x];
                if (box.version != version) {
                    box.across = null;
                    box.down = null;
                    box.version = version;
                }
                if (box.isBlackBox) {
                    break;
                }
                box.down = {
                    clue: downClueNumber,
                    char: downClue.length
                };
                downClue.push(box);
            }

            if (downClue.length > 1) {
                puzzle.down[downClueNumber] = downClue;
                if (isNewClue) {
                    clueCount++;
                }
            }
        };


        board.map(function (row, y) {
            let acrossClue = [];
            let acrossClueCount = clueCount;
            for (let x = 0, box=row[x]; x < row.length; x++, box=row[x]) {
                if (box.version != version) {
                    box.across = null;
                    box.down = null;
                    box.version = version;
                }
                if (box.isBlackBox) {
                    finishAcrossClue(acrossClue, acrossClueCount);
                    acrossClueCount = clueCount;
                    acrossClue = [];
                } else {
                    if (!(acrossClue.length === 0 && (x+1 >= row.length || row[x+1].isBlackBox))) {
                        box.across = {
                            clue: acrossClueCount,
                            char: acrossClue.length
                        };
                        acrossClue.push(box);
                    }
                    if (shouldMakeDownClue(x, y)) {
                        makeDownClue(x, y);
                    }
                }
            }
            finishAcrossClue(acrossClue, acrossClueCount);
        }, this);

        return puzzle;
    }

    handleBoxClick(box) {
        switch (this.props.mode) {
            case 'EDIT':
                box.isBlackBox = !box.isBlackBox;
                    box.value = null;
                    this.setState(
                        {
                            puzzle: this.createPuzzleFromBoard(this.state.board, this.state.version + 1),
                            version: (this.state.version + 1) % 100,
                            clues: this.updateCluesFromClickEvent(box)
                        }
                    );
                break;
            case 'SOLVE':
                // should select the clue we clicked on
                break;
        }

    }

    handleKeypress(key) {
        console.log(key);
    }

    handleClueClick(clue) {
        console.log(clue);
    }

    render() {
        //console.log(this.state.puzzle);
        return (<div className="crossword-container">
            <div className="crossword-board-container"><CrosswordBoard onClick={this.handleBoxClick} board={this.state.board} /></div>
            <div className="crossword-clues-container">
                <CrosswordClues type='across' onClick={this.handleClueClick} clues={this.state.clues.across} />
                <CrosswordClues type='down' onClick={this.handleClueClick} clues={this.state.clues.down} />
            </div>
        </div>);
    }
}

Crossword.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    mode: React.PropTypes.string
};

Crossword.defaultProps = {
    width: 15,
    height: 15,
    mode: 'EDIT'
};

module.exports = Crossword;