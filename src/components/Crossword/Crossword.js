import React from 'react';
import CrosswordBoard from './CrosswordBoard.js';
import CrosswordClues from './CrosswordClues.js';
import CrosswordHeader from './CrosswordHeader.js';
import CrosswordSelectedClue from './CrosswordSelectedClue.js';
import CrosswordTitle from './CrosswordTitle.js';
import Game from './../../objects/game.js';
import Clue from './../../objects/clue.js';
import {directions, boxState} from './../../util/constants.js';
import {otherDirection, toLetter} from './../../util/util.js';
import './Crossword.css';

class Crossword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            board: props.game.board,
            puzzle: props.game.puzzle,
            clues: props.game.clues,
            selectedClue: null
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
        this.selectBox(box);
    }

    /**
     * Callback when a character key is pressed.
     *
     * @param event
     */
    handleKeypress(event) {
        if (event.target.tagName === 'INPUT') {
            return;
        }

        var char = toLetter(event.keyCode || event.which);
        if (char) {
            event.preventDefault();
            let selectedClue = this.state.selectedClue;
            let selectedBox = this.state.selectedBox;
            if (selectedClue === null || selectedBox === null) {
                return;
            }

            selectedBox.value = char;
            if (selectedClue.focused === 'across') {
                this.selectBox(this.props.game.board.right(selectedBox));
            } else if (selectedClue.focused === 'down') {
                this.selectBox(this.props.game.board.below(selectedBox));
            } else {
                this.setState({
                    selectedBox: selectedBox
                });
            }
        }
    }

    /**
     * Callback when a keyboard button (non-character, ex: backspace or arrow keys) is pressed.
     *
     * @param event
     */
    handleKeydown(event) {
        if (event.target.tagName === 'INPUT') {
            return;
        }
        let selected = this.state.selectedClue;
        let selectedBox = this.state.selectedBox;

        switch (event.which) {
            case 8: // backspace
                event.preventDefault();
                if (selected === null || selectedBox === null) {
                    break;
                }

                if (!selectedBox.value) {
                    switch (selected.focused) {
                        case 'across':
                            selectedBox = this.props.game.board.left(selectedBox);
                            if (selectedBox) {
                                selectedBox.value = null;
                                this.selectBox(selectedBox);
                            }
                            break;
                        case 'down':
                            selectedBox = this.props.game.board.above(selectedBox);
                            if (selectedBox) {
                                selectedBox.value = null;
                                this.selectBox(selectedBox);
                            }
                            break;
                        default:
                            this.setState({
                                selectedBox: selectedBox
                            });
                    }
                } else {
                    selectedBox.value = null;
                    this.setState({
                        selectedBox: selectedBox
                    });
                }
                break;
            case 38: // up
                event.preventDefault();
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }
                if (selected.across && selected.focused === 'across') {
                    if (selected.down) {
                        this.selectBox(selectedBox, 'down');
                    } else {
                        this.selectBox(this.props.game.board.previous(selectedBox, 'down'), 'down');
                    }
                } else if (selected.down && selected.focused === 'down') {
                    this.selectBox(this.props.game.board.previous(selectedBox, 'down'));
                }
                break;
            case 39: // right
                event.preventDefault();
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }
                if (selected.down && selected.focused === 'down') {
                    if (selected.across) {
                        this.selectBox(selectedBox, 'across');
                    } else {
                        this.selectBox(this.props.game.board.next(selectedBox, 'across'), 'across');
                    }
                } else if (selected.across && selected.focused === 'across') {
                    this.selectBox(this.props.game.board.next(selectedBox, 'across'));
                }
                break;
            case 40: // down
                event.preventDefault();
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }
                if (selected.across && selected.focused === 'across') {
                    if (selected.down) {
                        this.selectBox(selectedBox, 'down');
                    } else {
                        this.selectBox(this.props.game.board.next(selectedBox, 'down'), 'down');
                    }
                } else if (selected.down && selected.focused === 'down') {
                    this.selectBox(this.props.game.board.next(selectedBox, 'down'));
                }
                break;
            case 37: // left
                event.preventDefault();
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }
                if (selected.down && selected.focused === 'down') {
                    if (selected.across) {
                        this.selectBox(selectedBox, 'across');
                    } else {
                        this.selectBox(this.props.game.board.previous(selectedBox, 'across'), 'across');
                    }
                } else if (selected.across && selected.focused === 'across') {
                    this.selectBox(this.props.game.board.previous(selectedBox, 'across'));
                }
                break;

        }
    }

    selectBox(box, direction) {
        if (box === null || box.isBlackBox()) {
            this.setState({
                selectedBox: this.state.selectedBox
            });
            return;
        }
        var focusedDirection = (function(box, selectedClue) {
            let dir = directions[0];
            if (direction) {
                dir = direction;
            } else if (selectedClue !== null && selectedClue.focused !== null) {
                dir = selectedClue.focused;
            }
            if (box[dir] === null) {
                dir = otherDirection(dir);
            }
            if (box[dir] === null) {
                return null;
            }
            return dir;
        })(box, this.state.selectedClue);

        var crossClue = box[otherDirection(focusedDirection)] !== null ?
            this.props.game.clues[otherDirection(focusedDirection)][box[otherDirection(focusedDirection)].clue] : null;
        var clue = box[focusedDirection] !== null ? this.props.game.clues[focusedDirection][box[focusedDirection].clue] : null;

        this.props.game.clearSelectedClues();
        this.props.game.selectClue(crossClue);
        this.props.game.selectClue(clue, boxState.FOCUSED);

        let selected = {across: null, down: null, focused: null};
        if (clue !== null) {
            selected[clue.direction] = clue.number;
        }
        if (crossClue !== null) {
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
        this.selectBox(this.props.game.puzzle[clue.direction][clue.number][0], clue.direction);
    }

    getSelectedClue() {
        if (this.state.selectedClue !== null) {
            if (this.state.selectedClue.focused) {
                return this.state.clues[this.state.selectedClue.focused][this.state.selectedClue[this.state.selectedClue.focused]];
            }
        }

        return null;
    }

    getHeaderItems() {
        return [];
    }

    render() {
        return (<div>
            <CrosswordTitle data={this.props.metadata} />
            <CrosswordHeader headerItems={this.getHeaderItems()} />
            <div className="crossword-container" >
                <div className="crossword-column-small" >
                    <CrosswordClues style={{marginRight: "25px", float: "right"}} type='across' onClick={this.handleClueClick} clues={this.state.clues.across} />
                </div>
                <div className="crossword-column-big" >
                    <CrosswordSelectedClue clue={this.getSelectedClue()} />
                    <CrosswordBoard onClick={this.handleBoxClick} board={this.state.board}/>
                </div>
                <div className="crossword-column-small" >
                    <CrosswordClues type='down' style={{marginLeft: "25px", float: "left"}} onClick={this.handleClueClick} clues={this.state.clues.down} />
                </div>
            </div>
        </div>);
    }
}

Crossword.propTypes = {
    game: React.PropTypes.instanceOf(Game).isRequired
};

module.exports = Crossword;