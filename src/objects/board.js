import Clue from './clue.js';
import Box from './box.js';

/**
 * Represents a crossword board.
 */
class Board {

    /**
     * Construct a blank Board with specified width and height.
     *
     * @param width the width of the board
     * @param height the height of the board
     */
    constructor(width, height) {
        this.version = 0;
        this.width = width;
        this.height = height;
        this.board = this.initBoard();
    }

    /**
     * Initialize the board.
     */
    initBoard() {
        var board = [];
        for (let y = 0; y < this.height; y++) {
            board[y] = [];
            for (let x = 0; x < this.width; x++) {
                board[y][x] = new Box((y*this.height) + x, this.version, x, y);
            }
        }
        return board;
    }

    /**
     * Get the row at the specified y value (0 is the top-most row).
     *
     * @param y
     * @returns an array of Boxes
     */
    row(y) {
        if (y < 0 || this.board.length < y) {
            return null;
        }
        return this.board[y];
    }

    /**
     * Get the Box at the specified (x,y) position on the Board ([0,0] is the top-left corner).
     *
     * @param x
     * @param y
     * @returns a Box
     */
    get(x, y) {
        if (x < 0 || y < 0 || y >= this.board.length  || x >= this.board[y].length) {
            return null;
        }
        return this.board[y][x];
    }

    above(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x, box.y - 1);
        }
    }

    left(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x - 1, box.y);
        }
    }

    below(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x, box.y + 1);
        }
    }

    right(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x + 1, box.y);
        }
    }

    /**
     * Set the value of the specified (x,y) position of the Board to the provided Box.
     *
     * @param box
     * @param x
     * @param y
     */
    set(box, x, y) {
        if (x < 0 || y < 0 || this.board.length < y || this.board[y].length < x) {
            return;
        }
        this.board[y][x] = box;
    }

    generateStateFromBoard() {
        this.version = (this.version + 1) % 100;
        var puzzle = {
            across: {},
            down: {}
        };
        var clues = {
            across: {},
            down: {}
        };
        var clueCount = 1;

        var finishAcrossClue = function(acrossClue, acrossClueCount) {
            if (acrossClue.length > 1) {
                puzzle.across[acrossClueCount] = acrossClue;
                clues.across[acrossClueCount] = new Clue('across', acrossClueCount);
                clueCount++;
            }
        };

        var shouldMakeDownClue = function(x, y, context) {
            let box = context.get(x,y);
            return (box.down === null && context.height > y+1 && !(context.get(x, y+1).isBlackBox()));
        };

        var makeDownClue = function(x, y, context) {
            let downClue = [];
            let start = context.get(x,y);
            let isNewClue = (start.across === null || start.across.char !== 0);
            let downClueNumber = isNewClue ? (start.across === null) ?  clueCount : clueCount + 1 : start.across.clue;

            for (let i = y; i < context.height; i++) {
                let box = context.get(x,i);
                if (box.version !== context.version) {
                    box.across = null;
                    box.down = null;
                    box.version = context.version;
                }
                if (box.isBlackBox()) {
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
                clues.down[downClueNumber] = new Clue('down', downClueNumber);
                if (isNewClue) {
                    clueCount++;
                }
            }
        };

        this.board.map(function (row, y) {
            let acrossClue = [];
            let acrossClueCount = clueCount;
            for (let x = 0, box=row[x]; x < row.length; x++, box=row[x]) {
                if (box.version !== this.version) {
                    box.across = null;
                    box.down = null;
                    box.version = this.version;
                }
                if (box.isBlackBox()) {
                    finishAcrossClue(acrossClue, acrossClueCount);
                    acrossClueCount = clueCount;
                    acrossClue = [];
                } else {
                    if (!(acrossClue.length === 0 && (x+1 >= row.length || row[x+1].isBlackBox()))) {
                        box.across = {
                            clue: acrossClueCount,
                            char: acrossClue.length
                        };
                        acrossClue.push(box);
                    }
                    if (shouldMakeDownClue(x, y, this)) {
                        makeDownClue(x, y, this);
                    }
                }
            }
            finishAcrossClue(acrossClue, acrossClueCount);
        }, this);

        return {puzzle: puzzle, clues: clues};
    }

    /**
     * Returns a 2-dimensional array containing all the values of this board.
     *
     * A null value indicates a black box, a "" value indicates an empty box.
     */
    values() {
        var result = [];
        for (let y = 0; y < this.height; y++) {
            result[y] = [];
            for (let x = 0; x < this.width; x++) {
                let box = this.get(x,y);
                if (box.isBlackBox()) {
                    result[y][x] = null;
                } else if (box.value === null) {
                    result[y][x] = "";
                } else {
                    result[y][x] = box.value;
                }
            }
        }
        return result;
    }


}

module.exports = Board;