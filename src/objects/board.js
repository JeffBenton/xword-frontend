import Clue from './clue.js';
import Box from './box.js';
import {boxState} from './../util/constants.js';

/**
 * Represents a crossword board.
 */
class Board {

    /**
     * Create a Board object from a saved board.
     *
     * Board.fromValues(board.values()) should result in the same 'board.'
     *
     * @param values
     * @returns {Board}
     */
    static fromValues(values = []) {
        if (values.length < 1 && values[0].length < 1) {
            throw "couldn't create board from values";
        }
        let b = new Board(values[0].length, values.length);
        let board = [];

        for (let y = 0; y < b.height; y++) {
            board[y] = [];
            for (let x = 0; x < b.width; x++) {
                let box = new Box((y*b.height) + x, b.version, x, y);

                if (values[y][x] == null || values[y][x].value === null) {
                    box.state = boxState.BLACKBOX;
                } else if (values[y][x] == " " || values[y][x].value == " ") {
                    box.value = null;
                } else {
                    box.value = typeof values[y][x] === "string" ? values[y][x] : values[y][x].value;
                }

                if (values[y][x] != null && values[y][x].attributes) {
                    box.attributes = values[y][x].attributes;
                }

                board[y][x] = box;
            }
        }

        b.board = board;
        return b;

    }
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

    /**
     * Get the Box above the provided box.
     *
     * Returns null if there isn't one (ex: the provided box is at the top of the board).
     *
     * @param box
     * @returns {*}
     */
    above(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x, box.y - 1);
        }
    }

    /**
     * Get the Box to the left of the provided box.
     *
     * Returns null if there isn't one (ex: the provided box is on the left edge of the board).
     *
     * @param box
     * @returns {*}
     */
    left(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x - 1, box.y);
        }
    }

    /**
     * Get the Box below the provided box.
     *
     * Returns null if there isn't one (ex: the provided box is at the bottom of the board).
     *
     * @param box
     * @returns {*}
     */
    below(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x, box.y + 1);
        }
    }

    /**
     * Get the Box to the right of the provided box.
     *
     * Returns null if there isn't one (ex: the provided box is on the right edge of the board).
     *
     * @param box
     * @returns {*}
     */
    right(box) {
        if (box === null || box.x === null || box.y === null) {
            return null;
        } else {
            return this.get(box.x + 1, box.y);
        }
    }

    /**
     * Get the 'next' Box in the specified direction from the specified Box.
     *
     * For direction = 'across', the 'next' Box is the next non-BLACKBOX Box to the right of the provided Box,
     * wrapping down if required.
     *
     * For direction = 'down', the 'next' Box is the next non-BLACKBOX Box below the provided Box,
     * wrapping back to the top if required.
     *
     * @param box
     * @param direction
     * @returns {*}
     *      the 'next' box
     */
    next(box, direction) {
        if (box === null || direction === null) {
            return null;
        }

        switch (direction) {
            case 'across':
                let getNextBoxFromRow = function(originalBox, row, startX = 0) {
                    for (let i = startX; i < row.length; i++) {
                        if (row[i] === originalBox || !row[i].isBlackBox()) {
                            return row[i];
                        }
                    }
                    return null;
                };
                let acrossBox = getNextBoxFromRow(box, this.row(box.y), box.x+1);
                if (acrossBox) {
                    return acrossBox;
                } else {
                    let y = box.y;
                    while (!acrossBox) {
                        y = (y + 1) % this.height;
                        acrossBox = getNextBoxFromRow(box, this.row(y), 0);
                    }
                    return acrossBox;
                }
            case 'down':
                let nextBox = this.below(box);
                do {
                    if (nextBox == null) {
                        nextBox = this.get(box.x, 0);
                    }
                    if (!nextBox.isBlackBox()) {
                        return nextBox;
                    }
                    nextBox = this.below(nextBox);
                } while (nextBox !== box);
                return nextBox;
            default:
                return null;
        }
    }

    /**
     * Get the 'previous' Box in the specified direction from the specified Box.
     *
     * For direction = 'across', the 'previous' Box is the next non-BLACKBOX Box to the left of the provided Box,
     * wrapping up if required.
     *
     * For direction = 'down', the 'next' Box is the next non-BLACKBOX Box above the provided Box,
     * wrapping back to the bottom if required.
     *
     * @param box
     * @param direction
     * @returns {*}
     *      the 'previous' box
     */
    previous(box, direction) {
        if (box === null || direction === null) {
            return null;
        }

        switch (direction) {
            case 'across':
                let getPreviousBoxFromRow = function(originalBox, row, startX) {
                    for (let i = startX; i >= 0; i--) {
                        if (row[i] === originalBox || !row[i].isBlackBox()) {
                            return row[i];
                        }
                    }
                    return null;
                };
                let acrossBox = getPreviousBoxFromRow(box, this.row(box.y), box.x-1);
                if (acrossBox) {
                    return acrossBox;
                } else {
                    let y = box.y;
                    while (!acrossBox) {
                        y = y - 1 >= 0 ? y - 1 : this.height - 1;
                        acrossBox = getPreviousBoxFromRow(box, this.row(y), this.width - 1);
                    }
                    return acrossBox;
                }
            case 'down':
                let nextBox = this.above(box);
                do {
                    if (nextBox == null) {
                        nextBox = this.get(box.x, this.height - 1);
                    }
                    if (!nextBox.isBlackBox()) {
                        return nextBox;
                    }
                    nextBox = this.above(nextBox);
                } while (nextBox !== box);
                return nextBox;
            default:
                return null;
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

    /**
     * Generate the puzzle and clue state from the provided board state.
     *
     * @returns {{puzzle: {across: {}, down: {}}, clues: {across: {}, down: {}}}}
     */
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
     * A null value indicates a black box, a " " value indicates an empty box.
     */
    values() {
        var result = [];
        for (let y = 0; y < this.height; y++) {
            result[y] = [];
            for (let x = 0; x < this.width; x++) {
                let box = this.get(x,y);
                result[y][x] = {
                    value: box.isBlackBox() ? null : (box.value === null ? " " : box.value),
                    attributes: box.attributes
                };
            }
        }
        return result;
    }
}

module.exports = Board;