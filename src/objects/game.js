let Board = require('./board.js');

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
        var state = this.board.generateStateFromBoard();
        this.puzzle = state.puzzle;
        this.clues = this.updateCluesAfterBoxChange(box, state);
    }

    updateCluesAfterBoxChange(box, state) {
        return state.clues;
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
     */


}

module.exports = Game;