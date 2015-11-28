let Board = require('./board.js');
let ClueHelper = require('./cluehelper.js');
/**
 * The Game object contains logic to manipulate the state of the crossword puzzle.
 */
class Game {

    constructor(width, height) {
        // initialize the board
        this.board = new Board(width, height);

        // initialize the game state
        var state = this.board.generateStateFromBoard();
        this.puzzle = state.puzzle;
        this.clues = state.clues;
    }

    /**
     * Toggle the status of the box at position (x,y) [the top-left corner is (0,0)].
     *
     * If the box is a black box, it will be an editable box. If the box is editable, it will be a black box.
     *
     * This will cause the puzzle and clues to recalculate.
     *
     * @param x
     * @param y
     */
    toggleBoxStatus(x, y) {
        // toggle the status of the box
        var box = this.board.get(x,y);
        box.isBlackBox = !box.isBlackBox;

        // update the game state based on the new board
        if (box.isBlackBox) {
            var state = this.board.generateStateFromBoard();
            this.puzzle = state.puzzle;
            var changes = this.determineCreateBlackBox(box);
            this.clues = state.clues;
        } else {
            var changes = this.determineRemoveBlackBox(box);
            var state = this.board.generateStateFromBoard();
            this.puzzle = state.puzzle;
            this.clues = state.clues;
        }
    }


    determineRemoveBlackBox(box) {
        // determine whether we deleted an existing across clue by adding this box
        var determineDeletedAcrossClue = function(board, box) {
            if (box.x > 0 && board.get(box.x-1, box.y).across != null) {
                if (box.x + 1 < board.width && board.get(box.x+1, box.y).across != null) {
                    var clue = ClueHelper.determineLostAcrossClue(board, box);
                    console.log('-: lost clue: ' + clue + ' across');
                    return clue;
                }
            }
        };

        var determineDeletedDownClue = function(board, box) {
            if (box.y > 0 && board.get(box.x, box.y-1).down != null) {
                if (box.y + 1 < board.height && board.get(box.x, box.y+1).down != null) {
                    var clue = board.get(box.x, box.y+1).down.clue;
                    console.log('-: lost clue: ' + clue + ' down');
                    return clue;
                }
            } else if (box.y === 0 && board.get(box.x, box.y+1).down != null) {
                var clue = board.get(box.x, box.y+1).down.clue;
                console.log('-: lost clue: ' + clue + ' down');
                return clue;

            }
        };

        determineDeletedAcrossClue(this.board, box);
        determineDeletedDownClue(this.board, box);
    }

    determineCreateBlackBox(box) {
        // determine whether we created a new across clue by adding this box
        var determineCreatedAcrossClue = function(board, box) {
            // check if the box to our right is part of an across clue
            if (board.width > box.x + 1 && board.get(box.x+1, box.y).across != null) {
                // make sure the box to our left is part of an across clue
                // (this means we just split an existing across clue with this new black box)
                if (box.x - 1 > 0 && board.get(box.x-1, box.y).across != null) {
                    console.log('+: created clue: ' + board.get(box.x+1,box.y).across.clue + ' across');
                    return board.get(box.x+1,box.y).across.clue;
                }
            }
            return null;
        };

        // determine whether we deleted an existing across clue by adding this box
        var determineDeletedAcrossClue = function(board, box) {
            if (box.x - 1 > 0 && board.get(box.x-1, box.y).across == null) {
                if (box.x + 1 < board.width && board.get(box.x+1, box.y).across == null) {
                    let lostAcrossClue = ClueHelper.determineLostAcrossClue(board, box);
                    console.log('+: lost clue: ' + lostAcrossClue + ' across');
                    return lostAcrossClue;
                }
            }
            return null;
        };

        // determine whether we created a new down clue by adding this box
        var determineCreatedDownClue = function(board, box) {
            if (board.height > box.y + 1 && board.get(box.x, box.y+1).down != null) {
                console.log('+: created clue: ' + board.get(box.x, box.y+1).down.clue + ' down');
                return board.get(box.x, box.y+1).down.clue;
            }
            return null;
        }

        var determineDeletedDownClue = function(board, box) {
            if (box.y === 0 || board.get(box.x, box.y-1).isBlackBox) {
                var lostDownClue = ClueHelper.determineLostDownClue(board, board.get(box.x,box.y));
                console.log('+: lost clue: ' + lostDownClue + ' down');
            } else if (box.y > 0 && board.get(box.x, box.y-1).down == null) {
                var lostDownClue = ClueHelper.determineLostDownClue(board, board.get(box.x,box.y-1));
                console.log('+: lost clue: ' + lostDownClue + ' down');
            }
        };

        return {
            across: {
                created: determineCreatedAcrossClue(this.board, box),
                deleted: determineDeletedAcrossClue(this.board, box)
            },
            down: {
                created: determineCreatedDownClue(this.board, box),
                deleted: determineDeletedDownClue(this.board, box)
            }
        };
    }

    /**
     *     updateCluesFromClickEvent(box) {
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
            // look right
            if (this.state.board[box.y].length > box.x + 1 && this.state.board[box.y][box.x+1].across != null
            && box.x - 1 > 0 && this.state.board[box.y][box.x-1].across != null) {
                console.log('created clue: ' + this.state.board[box.y][box.x+1].across.clue + ' across');
                createdAcrossClue = this.state.board[box.y][box.x+1].across.clue;
            }
            if (box.x + 1 < this.state.board[box.y].length &&
                box.x - 1 > 0 && this.state.board[box.y][box.x-1].across == null &&
                !this.state.board[box.y][box.x+1].isBlackBox &&
                this.state.board[box.y][box.x+1].across == null) {
                lostAcrossClue = this.determineLostAcrossClue(box);
                console.log('lost an across clue: ' + lostAcrossClue);
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
                if (number >= createdDownClue) {
                    offset++;
                }
                if (number == lostDownClue) {
                    continue;
                } else if (number > lostDownClue) {
                    offset--;
                }
                clues['down'][offset] = this.state.clues.down[number];
                clues['down'][offset].number = offset;
            }
            console.log(this.state.clues.across);
            for (var number in this.state.clues.across) {
                var offset = number;
                if (offset >= createdAcrossClue &&
                    (this.state.clues.down[createdAcrossClue] == null || createdAcrossClue == lostDownClue)) {
                    offset++;
                }
                if (offset >= createdDownClue) {
                    offset++;
                }
                if (offset >= lostDownClue) {
                    offset--;
                }
                if (number == lostAcrossClue) {
                    // this is probably wrong
                    continue;
                } else if (number > lostAcrossClue) {
                    offset--;
                }
                clues['across'][offset] = this.state.clues.across[number];
                clues['across'][offset].number = offset;
            }

        } else {
            // if we turned this box into a normal box, we probably have fewer clues.
        }
        console.log(clues);
        return clues;
    }
     */


}

module.exports = Game;