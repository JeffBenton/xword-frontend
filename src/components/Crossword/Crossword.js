import React from 'react';
import CrosswordBoard from './../Crossword/CrosswordBoard.js';
import CrosswordClues from './../Crossword/CrosswordClues.js';
import Game from './../../objects/game.js';
import Clue from './../../objects/clue.js';
import {directions, boxState, otherDirection} from './../../objects/constants.js';

class Crossword extends React.Component {

    constructor(props) {
        super(props);
        this.game = new Game(props.width, props.height);

        this.state = {
            board: this.game.board,
            puzzle: this.game.puzzle,
            clues: this.game.clues,
            selectedClue: {across: null, down: null, focused: null}
        };

        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleClueClick = this.handleClueClick.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keypress', this.handleKeypress);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('keypress', this.handleKeypress);
    }

    handleBoxClick(box) {
        switch (this.props.mode) {
            case 'EDIT':
                this.game.toggleBoxStatus(box.x, box.y);
                this.setState(
                    {
                        board: this.game.board,
                        puzzle: this.game.puzzle,
                        clues: this.game.clues,
                        selectedBox: null,
                        selectedClue: {across: null, down: null, focused: null}
                    }
                );
                break;
            case 'SOLVE':
                // should select the clue we clicked on
                break;
        }

    }

    /**
     * Callback when a character key is pressed.
     *
     * @param e
     */
    handleKeypress(event) {
        console.log(event);
        var char = String.fromCharCode(event.keyCode || event.which);
        if (char) {
            event.preventDefault();
            console.log(char);
        }
    }

    /**
     * Callback when a keyboard button (non-character, ex: backspace or arrow keys) is pressed.
     *
     * @param e
     */
    handleKeydown(event) {
        let selected = this.state.selectedClue;
        console.log(selected);
        switch (event.which) {
            case 8: // backspace
                event.preventDefault();
                break;
            case 38: // up
                event.preventDefault();
                if (selected.across && selected.focused == 'across') {
                    if (selected.down) {
                        selected.focused = 'down';
                        this.game.clearSelectedClues();
                        this.game.selectClue(this.game.clues['across'][selected.across], boxState.SELECTED);
                        this.game.selectClue(this.game.clues['down'][selected.down], boxState.FOCUSED);
                        this.selectBox(this.state.selectedBox);
                        this.setState({selectedClue: selected});
                    }
                }
                break;
            case 39: // right
                event.preventDefault();
                if (selected.down && selected.focused == 'down') {
                    if (selected.across) {
                        selected.focused = 'across';
                        this.game.clearSelectedClues();
                        this.game.selectClue(this.game.clues['down'][selected.down], boxState.SELECTED);
                        this.game.selectClue(this.game.clues['across'][selected.across], boxState.FOCUSED);
                        this.selectBox(this.state.selectedBox);
                        this.setState({selectedClue: selected});
                    }
                }
                break;
            case 40: // down
                event.preventDefault();
                if (selected.across && selected.focused == 'across') {
                    if (selected.down) {
                        selected.focused = 'down';
                        this.game.clearSelectedClues();
                        this.game.selectClue(this.game.clues['across'][selected.across], boxState.SELECTED);
                        this.game.selectClue(this.game.clues['down'][selected.down], boxState.FOCUSED);
                        this.selectBox(this.state.selectedBox);
                        this.setState({selectedClue: selected});
                    }
                }
                break;
            case 37: // left
                event.preventDefault();
                if (selected.down && selected.focused == 'down') {
                    if (selected.across) {
                        selected.focused = 'across';
                        this.game.clearSelectedClues();
                        this.game.selectClue(this.game.clues['down'][selected.down], boxState.SELECTED);
                        this.game.selectClue(this.game.clues['across'][selected.across], boxState.FOCUSED);
                        this.selectBox(this.state.selectedBox);
                        this.setState({selectedClue: selected});
                    }
                }
                break;

        }
    }

    selectBox(box) {
        if (this.state.selectedBox != null && this.state.selectedBox.state == boxState.ACTIVE) {
            this.state.selectedBox.state = boxState.NORMAL;
        }
        box.state = boxState.ACTIVE;
        this.setState({
            selectedBox: box
        });
    }

    handleClueClick(clue) {
        this.game.clearSelectedClues();
        var crossClue = this.game.clues[otherDirection(clue.direction)][this.game.puzzle[clue.direction][clue.number][0][otherDirection(clue.direction)].clue];

        this.game.selectClue(crossClue, boxState.SELECTED);
        this.game.selectClue(clue, boxState.FOCUSED);
        this.selectBox(this.game.puzzle[clue.direction][clue.number][0]);

        let selected = {across: null, down: null, focused: null};
        selected[clue.direction] = clue.number;
        selected[crossClue.direction] = crossClue.number;
        selected.focused = clue.direction;

        this.setState(
            {
                selectedClue: selected
            }
        );
    }

    render() {
        return (<div className="crossword-container" onKeyDown={this.handleKeypress}>
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