import Board from './board.js';
import ClueHelper from './cluehelper.js';
import {directions, boxState} from './constants.js';

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
     */
    selectClue(clue, state = boxState.SELECTED) {
        for (let i = 0; i < this.puzzle[clue.direction][clue.number].length; i++) {
            this.puzzle[clue.direction][clue.number][i].state = state;
        }
        this.clues[clue.direction][clue.number].isSelected = true;
    }

    /**
     * Deselect all selected clues.
     */
    clearSelectedClues() {
        for (let dir in directions) {
            if (directions.hasOwnProperty(dir)) {
                let direction = directions[dir];
                for (let number in this.puzzle[direction]) {
                    if (this.puzzle[direction].hasOwnProperty(number)) {
                        for (let i = 0; i < this.puzzle[direction][number].length; i++) {
                            this.puzzle[direction][number][i].state = boxState.NORMAL;
                        }
                        this.clues[direction][number].isSelected = false;
                    }
                }
            }
        }
    }
}

module.exports = Game;