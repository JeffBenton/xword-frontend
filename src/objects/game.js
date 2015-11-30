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
            let state = this.board.generateStateFromBoard();
            this.puzzle = state.puzzle;
            this.clues = state.clues;
            //let changes = this.determineCreateBlackBox(box);
            //this.clues = this.updateClues(this.clues, state.clues, changes)
        } else {
            //let changes = this.determineRemoveBlackBox(box);
            let state = this.board.generateStateFromBoard();
            this.puzzle = state.puzzle;
            this.clues = state.clues;
            //this.clues = this.updateClues(this.clues, state.clues, changes);
        }
    }

    updateClues(oldclues, newclues, changes) {
        console.log(changes);
        console.log(oldclues);
        console.log(newclues);
        if (changes.down.created && changes.down.deleted) {
            //newclues.down[changes.down.created] = oldclues.down[changes.down.deleted];
        }
        return newclues;
    }

}

module.exports = Game;