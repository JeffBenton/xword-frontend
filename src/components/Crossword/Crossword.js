let React = require('react');
let CrosswordBoard = require('./../Crossword/CrosswordBoard.js');

class Box {

    constructor(id, version) {
        this.id = id;
        this.value = null;
        //this.isCorrect = false;
        this.isBlackBox = false;
        this.isSelected = false;
        this.version = version;
        this.across = null;
        this.down = null;
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
                board[i][j] = new Box((i*props.height) + j, 0);
            }
        }

        this.state = {
            version: 0,
            board: board,
            puzzle: this.createPuzzleFromBoard(board, 0),
            selected: null
        };

        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }

    createPuzzleFromBoard(board, version) {
        var puzzle = {
            across: {},
            down: {}
        };
        var clueCount = 1;

        var finishAcrossClue = function(acrossClue) {
            if (acrossClue.length > 1) {
                puzzle.across[clueCount] = acrossClue;
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
            for (let x = 0, box=row[x]; x < row.length; x++, box=row[x]) {
                if (box.version != version) {
                    box.across = null;
                    box.down = null;
                    box.version = version;
                }
                if (box.isBlackBox) {
                    finishAcrossClue(acrossClue);
                    acrossClue = [];
                } else {
                    if (!(acrossClue.length === 0 && (x+1 >= row.length || row[x+1].isBlackBox))) {
                        box.across = {
                            clue: clueCount,
                            char: acrossClue.length
                        };
                        acrossClue.push(box);
                    }
                    if (shouldMakeDownClue(x, y)) {
                        makeDownClue(x, y);
                    }
                }
            }
            finishAcrossClue(acrossClue);
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
                            version: (this.state.version + 1) % 100
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

    render() {
        return (<div><CrosswordBoard onClick={this.handleBoxClick} board={this.state.board} /></div>);
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