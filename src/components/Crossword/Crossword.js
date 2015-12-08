import React from 'react';
import CrosswordBoard from './CrosswordBoard.js';
import CrosswordClues from './CrosswordClues.js';
import CrosswordHeader from './CrosswordHeader.js';
import Game from './../../objects/game.js';
import Clue from './../../objects/clue.js';
import {directions, boxState, otherDirection, toLetter} from './../../objects/constants.js';

class Crossword extends React.Component {

    constructor(props) {
        super(props);
        this.game = new Game(props.width, props.height);

        this.state = {
            board: this.game.board,
            puzzle: this.game.puzzle,
            clues: this.game.clues,
            selectedClue: null,
            clickAction: 'CREATEBOX'
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
            case 'CREATE':
                switch(this.state.clickAction) {
                    case 'CREATEBOX':
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
                    case 'SELECT':
                        // should select the clue we clicked on
                        this.selectBox(box);
                        break;

                }
                break;
            case 'SOLVE':
                // should select the clue we clicked on
                this.selectBox(box);
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
        var char = toLetter(event.keyCode || event.which);
        if (char) {
            event.preventDefault();
            console.log(char);
            let selectedClue = this.state.selectedClue;
            let selectedBox = this.state.selectedBox;
            if (selectedClue == null || selectedBox == null) {
                return;
            }

            selectedBox.value = char;
            switch (selectedClue.focused) {
                case 'across':
                    this.selectBox(this.game.board.right(selectedBox));
                    break;
                case 'down':
                    this.selectBox(this.game.board.below(selectedBox));
                    break;
                default:
                    this.setState({
                        selectedBox: selectedBox
                    });
            }
        }
    }

    /**
     * Callback when a keyboard button (non-character, ex: backspace or arrow keys) is pressed.
     *
     * @param e
     */
    handleKeydown(event) {
        let selected = this.state.selectedClue;
        let selectedBox = this.state.selectedBox;

        switch (event.which) {
            case 8: // backspace
                event.preventDefault();
                if (selected == null || selectedBox == null) {
                    return;
                }
                if (selectedBox.value != null) {
                    selectedBox.value = null;
                    this.setState({
                        selectedBox: selectedBox
                    });
                } else {
                    switch (selected.focused) {
                        case 'across':
                            this.selectBox(this.game.board.left(selectedBox));
                            break;
                        case 'down':
                            this.selectBox(this.game.board.above(selectedBox));
                            break;
                        default:
                            this.setState({
                                selectedBox: selectedBox
                            });
                    }
                }
                break;
            case 38: // up
                event.preventDefault();
                if (selected == null || (selected.across == null && selected.down == null)) {
                    this.selectBox(this.game.board.get(0,0));
                    return;
                }
                if (selected.across && selected.focused == 'across') {
                    if (selected.down) {
                        this.selectBox(selectedBox, 'down');
                    }
                } else if (selected.down && selected.focused == 'down') {
                    this.selectBox(this.game.board.above(selectedBox));
                }
                break;
            case 39: // right
                event.preventDefault();
                if (selected == null || (selected.across == null && selected.down == null)) {
                    this.selectBox(this.game.board.get(0,0));
                    return;
                }
                if (selected.down && selected.focused == 'down') {
                    if (selected.across) {
                        this.selectBox(selectedBox, 'across');
                    }
                } else if (selected.across && selected.focused == 'across') {
                    this.selectBox(this.game.board.right(selectedBox));
                }
                break;
            case 40: // down
                event.preventDefault();
                if (selected == null || (selected.across == null && selected.down == null)) {
                    this.selectBox(this.game.board.get(0,0));
                    return;
                }
                if (selected.across && selected.focused == 'across') {
                    if (selected.down) {
                        this.selectBox(selectedBox, 'down');
                    }
                } else if (selected.down && selected.focused == 'down') {
                    this.selectBox(this.game.board.below(selectedBox));
                }
                break;
            case 37: // left
                event.preventDefault();
                if (selected == null || (selected.across == null && selected.down == null)) {
                    this.selectBox(this.game.board.get(0,0));
                    return;
                }
                if (selected.down && selected.focused == 'down') {
                    if (selected.across) {
                        this.selectBox(selectedBox, 'across');
                    }
                } else if (selected.across && selected.focused == 'across') {
                    this.selectBox(this.game.board.left(selectedBox));
                }
                break;

        }
    }

    selectBox(box, direction) {
        if (box == null || box.isBlackBox()) {
            this.setState({
                selectedBox: this.state.selectedBox
            });
            return;
        }
        var focusedDirection = direction || (function(box, selectedClue) {
            let dir = directions[0];
            if (selectedClue != null && selectedClue.focused != null) {
                dir = selectedClue.focused;
            }
            if (box[dir] == null) {
                dir = otherDirection(dir);
            }
            if (box[dir] == null) {
                return null;
            }
            return dir;
        })(box, this.state.selectedClue);

        var crossClue = box[otherDirection(focusedDirection)] != null ?
            this.game.clues[otherDirection(focusedDirection)][box[otherDirection(focusedDirection)].clue] : null;
        var clue = box[focusedDirection] != null ? this.game.clues[focusedDirection][box[focusedDirection].clue] : null;

        this.game.clearSelectedClues();
        this.game.selectClue(crossClue);
        this.game.selectClue(clue, boxState.FOCUSED);

        let selected = {across: null, down: null, focused: null};
        if (clue != null) {
            selected[clue.direction] = clue.number;
        }
        if (crossClue != null) {
            selected[crossClue.direction] = crossClue.number;

        }
        selected.focused = focusedDirection;

        box.state = boxState.ACTIVE;
        this.setState({
            selectedBox: box,
            selectedClue: selected
        });
    }

    handleClueClick(clue) {
        this.selectBox(this.game.puzzle[clue.direction][clue.number][0], clue.direction);
    }

    getHeaderItems() {
        return [{
            name: "create",
            onClick: function(context) {
                return function() {
                    context.setState({clickAction: 'CREATEBOX'});
                }
            }(this)
        },
        {
            name: "select",
            onClick: function(context) {
                return function() {
                    context.setState({clickAction: 'SELECT'});
                }
            }(this)
        }]
    }

    render() {
        return (<div className="crossword-container" onKeyDown={this.handleKeypress}>
            <div className="crossword-board-header"><CrosswordHeader headerItems={this.getHeaderItems()} /></div>
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
    mode: 'CREATE'
};

module.exports = Crossword;