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

        let deletes = ClueHelper.determineDeletedClues(this.board, box);
        box.isBlackBox = !box.isBlackBox;

        let state = this.board.generateStateFromBoard();
        let creates = ClueHelper.determineCreatedClues(this.board, box);

        this.puzzle = state.puzzle;
        this.clues = ClueHelper.updateClues(this.clues, state.clues, creates, deletes);
    }
}

module.exports = Game;