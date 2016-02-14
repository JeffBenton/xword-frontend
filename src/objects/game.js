import Board from './board.js';
import ClueHelper from './cluehelper.js';
import {directions, boxState} from './../util/constants.js';

/**
 * The Game object contains logic to manipulate the state of the crossword puzzle.
 */
class Game {

    /**
     * Create a Game object from a saved puzzle.
     *
     * @param board the saved board
     * @param clues the saved clues
     * @returns {Game}
     */
    static fromSavedPuzzle(board = [], clues = []) {
        if (board.length < 1) {
            throw "error while creating game from saved puzzle. board height must be > 0.";
        }
        let g = new Game(board[0].length, board.length);
        g.board = Board.fromValues(board);
        var state = g.board.generateStateFromBoard();

        g.puzzle = state.puzzle;
        for (let i = 0; i < clues.length; i++) {
            state.clues[clues[i].direction.toLowerCase()][clues[i].number].text = clues[i].text;
        }
        g.clues = state.clues;
        return g;
    }

    /**
     * Create a blank crossword puzzle with the specified width and height.
     *
     * @param width
     * @param height
     */
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
        this.clearSelectedClues();

        // toggle the status of the box
        var box = this.board.get(x,y);

        let deletes = ClueHelper.determineDeletedClues(this.board, box);

        box.toggleBlackBoxState();

        let state = this.board.generateStateFromBoard();
        let creates = ClueHelper.determineCreatedClues(this.board, box);

        this.puzzle = state.puzzle;
        this.clues = ClueHelper.updateClues(this.clues, state.clues, creates, deletes);
    }

    /**
     * Select a clue.
     *
     * @param clue
     * @param state (default: boxState.SELECTED)
     */
    selectClue(clue, state = boxState.SELECTED) {
        if (clue === null) {
            return;
        }
        for (let i = 0; i < this.puzzle[clue.direction][clue.number].length; i++) {
            this.puzzle[clue.direction][clue.number][i].state = state;
        }
        this.clues[clue.direction][clue.number].isSelected = true;
    }

    /**
     * Deselect all selected clues.
     */
    clearSelectedClues() {
        Object.keys(directions).forEach((dir) => {
            let direction = directions[dir];
            Object.keys(this.puzzle[direction]).forEach((number) => {
                for (let i = 0; i < this.puzzle[direction][number].length; i++) {
                    this.puzzle[direction][number][i].state = boxState.NORMAL;
                }
                this.clues[direction][number].isSelected = false;
            });
        });
    }

    /**
     * Get the next box after the provided box in the specified direction.
     *
     * This should be called to determine the next box to select after receiving input. Note that the strategy
     * to determine the 'next' box is different depending on whether we're navigating around (ex: using the arrow keys)
     * vs altering the puzzle (ex: using 'backspace' or entering characters). This method handles the latter case. Use
     * 'nextNavigateBox' for the former.
     *
     * @param box
     *          the current box
     * @param direction
     *          the direction to move in
     * @returns {*}
     *          the next box
     */
    nextInputBox(box, direction) {
        let func = {
            across: 'right',
            down: 'below'
        };

        if (!func[direction]) {
            return box;
        }

        let result = this.board[func[direction]](box);
        if (result && !result.isBlackBox()) {
            return result;
        } else {
            return this.nextClue(box[direction].clue, direction);
        }
    }

    /**
     * Get the next box after the provided box in the specified direction.
     *
     * This should be called to determine the next box to select when navigating. Note that the strategy to
     * determine the 'next' box is different depending on whether we're navigating around (ex: using the arrow
     * keys) vs altering the puzzle (ex: using 'backspace' or entering characters). This method handles the former
     * case. Use 'nextInputBox' for the latter.
     *
     * @param box
     *          the current box
     * @param direction
     *          the direction to move in
     * @returns {*}
     *          the previous box
     */
    nextNavigateBox(box, direction) {
        return this.board.next(box, direction);
    }

    /**
     * Get the box before the provided box in the specified direction.
     *
     * This should be called to determine the previous box to select when navigating. Note that the strategy to
     * determine the 'previous' box is different depending on whether we're navigating around (ex: using the arrow
     * keys) vs altering the puzzle (ex: using 'backspace' or entering characters). This method handles the former
     * case. Use 'previousInputBox' for the latter.
     *
     * @param box
     *          the current box
     * @param direction
     *          the direction to move in
     * @returns {*}
     *          the previous box
     */
    previousNavigateBox(box, direction) {
        return this.board.previous(box, direction);
    }

    /**
     * Get the box before the provided box in the specified direction.
     *
     * This should be called to determine the previous box to select after receiving input. Note that the strategy
     * to determine the 'previous' box is different depending on whether we're navigating around (ex: using the arrow
     * keys) vs altering the puzzle (ex: using 'backspace' or entering characters). This method handles the latter
     * case. Use 'previousNavigateBox' for the former.
     *
     * @param box
     *          the current box
     * @param direction
     *          the direction to move in
     * @returns {*}
     *          the previous box
     */
    previousInputBox(box, direction) {
        let func = {
            across: 'left',
            down: 'above'
        };

        if (!func[direction]) {
            return box;
        }

        let result = this.board[func[direction]](box);
        if (result && !result.isBlackBox()) {
            return result;
        } else {
            return this.previousClue(box[direction].clue, direction);
        }
    }

    /**
     * Get first box in the next clue, starting with 'number' in the provided direction.
     *
     * Wraps.
     *
     * @param number the number to start at
     * @param direction the direction of clues
     */
    nextClue(number, direction) {
        let first;
        for (let i in this.puzzle[direction]) {
            if (!first) {
                first = i;
            }
            if (i > number) {
                return this.puzzle[direction][i][0];
            }
        }
        return this.puzzle[direction][first][0];
    }

    /**
     * Get last box in the previous clue, starting with 'number' in the provided direction.
     *
     * Wraps.
     *
     * @param number the number to start at
     * @param direction the direction of clues
     */
    previousClue(number, direction) {
        let last, result = 0;
        for (let i in this.puzzle[direction]) {
            last = i;
            if (i < number && i > result) {
                result = parseInt(i);
            }
            if (i >= number && result !== 0) {
                return this.puzzle[direction][result][this.puzzle[direction][result].length - 1];
            }
        }
        return this.puzzle[direction][last][this.puzzle[direction][last].length - 1];

    }

    /**
     * Convert this game into a savable state, in order to save this into a database.
     *
     * @returns
     *      {{
     *          board: 2d array of box values, as string. null for black box, space for empty box.,
     *          clues: list containing each clue in the puzzle
     *      }}
     */
    getSaveState() {
        var response = {
            board: this.board.values(),
            clues: (function (clues, puzzle) {

                // flatten the clues structure into a simple array of clues.
                let result = [];
                Object.keys(clues).forEach((dir) => {
                    Object.keys(clues[dir]).forEach((num) => {
                        let clue = {
                            number: clues[dir][num].number,
                            direction: clues[dir][num].direction.toLocaleUpperCase(),
                            text: clues[dir][num].text,
                            answer: (function (dir, num, puzzle) {
                                let result = [];
                                Object.keys(puzzle[dir][num]).forEach((index) => {
                                    let box = puzzle[dir][num][index];
                                    result.push(box.value === null ? "" : box.value);
                                });
                                return result;
                            }(dir, num, puzzle))
                        };
                        result.push(clue);
                    });
                });
                return result;
            }(this.clues, this.puzzle))
        };
        return response;
    }
}

module.exports = Game;