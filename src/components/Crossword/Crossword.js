import React from 'react';
import CrosswordBoard from './CrosswordBoard.js';
import CrosswordClues from './CrosswordClues.js';
import CrosswordHeader from './CrosswordHeader.js';
import CrosswordSelectedClue from './CrosswordSelectedClue.js';
import CrosswordTitle from './CrosswordTitle.js';
import CrosswordMetadata from './CrosswordMetadata.js';
import Game from './../../objects/game.js';
import Metadata from './../../objects/metadata.js';
import Clue from './../../objects/clue.js';
import {directions, boxState} from './../../util/constants.js';
import {otherDirection, toLetter, once} from './../../util/util.js';
import './Crossword.css';

/**
 * The base solvable Crossword element.
 *
 * This element is responsible for:
 *      creating and positioning all the child elements for the solvable Crossword game (ex: board, clues, metadata)
 *      accepting user input on the Crossword puzzle and updating the state of the game (ex: mouse clicks, keyboard input)
 *
 * props:
 *      game - Game - a Game object containing the state of the game
 *      metadata - Metadata - a Metadata object containing the game metadata
 *      solver - object - a helper object containing functions to get puzzle answers
 *      onChange - function - a function to call if anything changes
 */
class Crossword extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            board: props.game.board,
            puzzle: props.game.puzzle,
            clues: props.game.clues,
            selectedClue: null,
            request: null
        };

        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleClueClick = this.handleClueClick.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
    }

    /**
     * Initialize event handlers when the component mounts.
     */
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keypress', this.handleKeypress);
    }

    /**
     * Destroy event handlers when the component unmounts.
     */
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeydown);
        window.removeEventListener('keypress', this.handleKeypress);
        window.removeEventListener('keyup', this.handleKeyup);
    }

    /**
     * Handle a click on a crossword puzzle box.
     *
     * @param box the box object that got clicked on
     */
    handleBoxClick(box) {
        this.selectBox(box);
    }

    /**
     * Handle a keyup event.
     *
     * We listen to keyup events only if we hear a shift key get pressed (the user can hold down shift to enter
     * multiple values in a single box). When shift gets unpressed, we should move to the next box.
     *
     * @param event
     */
    handleKeyup(event) {
        // listen for shift getting unpressed
        if (event.which == 16) {
            // move to the next box and remove this event listener
            let selectedBox = this.props.game.nextInputBox(this.state.selectedBox, this.state.selectedClue.focused);
            this.selectBox(selectedBox);
            this.setState({shift: false});
            window.removeEventListener(event.type, this.handleKeyup);
        }
    }

    /**
     * Callback when a character key is pressed.
     *
     * @param event
     */
    handleKeypress(event) {
        // if we're focused on something else, do nothing
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // convert the event value to a letter
        var char = toLetter(event.keyCode || event.which);
        if (char) {
            // ok, we have a letter.
            event.preventDefault();
            let selectedClue = this.state.selectedClue;
            let selectedBox = this.state.selectedBox;
            if (selectedClue === null || selectedBox === null) {
                return;
            }

            if (event.shiftKey) {
                // if we're holding shift, append this char value to the current box
                selectedBox.set(selectedBox.get() + char);
                this.selectBox(selectedBox);
                if (!this.state.shift) {
                    this.setState({shift: true});
                    window.addEventListener('keyup', this.handleKeyup);
                }
            } else {
                // if not, replace the value in the box with this char, then select the next box
                selectedBox.set(char);
                selectedBox = this.props.game.nextInputBox(selectedBox, selectedClue.focused);
                this.selectBox(selectedBox);
            }

            // tell the boss that the puzzle changed
            if (this.props.onChange) {
                this.props.onChange();
            }
        }
    }

    /**
     * Callback when a keyboard button (non-character, ex: backspace or arrow keys) is pressed.
     *
     * @param event
     */
    handleKeydown(event) {
        // if we're focused on something else, do nothing
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
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

                // if the box we're in doesn't have a value, go to the previous box
                if (!selectedBox.value) {
                    selectedBox = this.props.game.previousInputBox(selectedBox, selected.focused);
                }

                // clear the value in this box
                selectedBox.clearValue();
                this.selectBox(selectedBox);

                // the puzzle changed
                if (this.props.onChange) {
                    this.props.onChange();
                }
                break;
            case 38: // up
                event.preventDefault();

                // if we don't have anything selected, select a box and quit
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }

                if (selected.across && selected.focused === 'across') {
                    // if we're currently focused on the 'across' clue, change to focusing the 'down' clue
                    if (selected.down) {
                        this.selectBox(selectedBox, 'down');
                    } else {
                        this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'down'), 'down');
                    }
                } else if (selected.down && selected.focused === 'down') {
                    // if we're currently focused on the 'down' clue, select the previous box
                    this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'down'));
                }
                break;
            case 39: // right
                event.preventDefault();

                // if we don't have anything selected, select a box and quit
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }

                if (selected.down && selected.focused === 'down') {
                    // if we're currently focused on the 'down' clue, change to focusing the 'across' clue
                    if (selected.across) {
                        this.selectBox(selectedBox, 'across');
                    } else {
                        this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'across'), 'across');
                    }
                } else if (selected.across && selected.focused === 'across') {
                    // if we're currently focused on the 'across' clue, select the next box
                    this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'across'));
                }
                break;
            case 40: // down
                event.preventDefault();

                // if we don't have anything selected, select a box and quit
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }
                if (selected.across && selected.focused === 'across') {
                    // if we're currently focused on the 'across' clue, change to focusing the 'down' clue
                    if (selected.down) {
                        this.selectBox(selectedBox, 'down');
                    } else {
                        this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'down'), 'down');
                    }
                } else if (selected.down && selected.focused === 'down') {
                    // if we're currently focused on the 'down' clue, select the next box
                    this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'down'));
                }
                break;
            case 37: // left
                event.preventDefault();

                // if we don't have anything selected, select a box and quit
                if (selected === null || (selected.across === null && selected.down === null)) {
                    this.selectBox(this.props.game.board.get(0,0));
                    break;
                }
                if (selected.down && selected.focused === 'down') {
                    // if we're currently focused on the 'down' clue, change to focusing the 'across' clue
                    if (selected.across) {
                        this.selectBox(selectedBox, 'across');
                    } else {
                        this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'across'), 'across');
                    }
                } else if (selected.across && selected.focused === 'across') {
                    // if we're currently focused on the 'across' clue, select the next box
                    this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'across'));
                }
                break;

        }
    }

    /**
     * Select a box.
     *
     * Update boxes in the puzzle indicating that they're SELECTED (part of the cross-clue), FOCUSED (part of
     * the focused clue), ACTIVE (the box that'll change if you type something), or NORMAL (none of the above).
     *
     * @param box the box we're selecting
     * @param direction the direction we're focusing, or null if we should decide by ourselves
     */
    selectBox(box, direction) {
        // we shouldn't do anything if: box is null, box is a black box (can't select it), or if the
        // currently selected box isn't changing
        if (box === null || box.isBlackBox() || (this.state.selectedBox == box
                                                    && direction == this.state.selectedClue.focused)) {
            this.setState({
                selectedBox: this.state.selectedBox
            });
            return;
        }

        // determine the focus direction.
        var focusedDirection = ((box) => {
            let selectedClue = this.state.selectedClue;
            let dir = directions[0]; // default: 'across'

            if (direction) {
                // if we have 'direction' passed in to us, try using that
                dir = direction;
            } else if (selectedClue !== null && selectedClue.focused !== null) {
                // if not, use the same direction as last time
                dir = selectedClue.focused;
            }

            // check if the box actually has a clue in this direction. if it doesn't, use the other direction.
            if (box[dir] === null) {
                dir = otherDirection(dir);
            }

            // help. you cant have a box that isnt part of a clue. this is a crossword puzzle.
            if (box[dir] === null) {
                return null;
            }

            // we did it.
            return dir;
        })(box);

        // the 'crossClue' is the clue perpendicular to the focused direction.
        var crossClue = box[otherDirection(focusedDirection)] !== null ?
            this.props.game.clues[otherDirection(focusedDirection)][box[otherDirection(focusedDirection)].clue] : null;
        // the 'clue' is the clue in the focused direction
        var clue = box[focusedDirection] !== null ? this.props.game.clues[focusedDirection][box[focusedDirection].clue] : null;

        // lets do this.
        this.props.game.clearSelectedClues();
        this.props.game.selectClue(crossClue);
        this.props.game.selectClue(clue, boxState.FOCUSED);

        // create a new selected clue object for our newly selected clue
        let selected = {across: null, down: null, focused: null};
        if (clue !== null) {
            selected[clue.direction] = clue.number;
        }
        if (crossClue !== null) {
            selected[crossClue.direction] = crossClue.number;

        }
        selected.focused = focusedDirection;

        // activate this box
        box.state = boxState.ACTIVE;

        // we did it.
        this.setState({
            selectedBox: box,
            selectedClue: selected
        });
    }

    /**
     * Handle clicking on a specific clue.
     *
     * Selects the first box in the clue.
     *
     * @param clue
     */
    handleClueClick(clue) {
        this.selectBox(this.props.game.puzzle[clue.direction][clue.number][0], clue.direction);
    }

    /**
     * Get the currently selected clue object, or null if nothing is selected.
     *
     * @returns {*}
     */
    getSelectedClue() {
        if (this.state.selectedClue !== null) {
            if (this.state.selectedClue.focused) {
                return this.state.clues[this.state.selectedClue.focused][this.state.selectedClue[this.state.selectedClue.focused]];
            }
        }
        return null;
    }

    /**
     * Create a list of header items for this solvable crossword puzzle.
     *
     * @returns {*}
     */
    getHeaderItems() {
        // if we have a solver object, we can make the verify/answer header items.
        // the solver object contains functions that make api requests to verify/answer parts of a puzzle
        if (this.props.solver) {
            // 'this.state.request' tracks whether we currently have an active request, so we can avoid sending
            // multiple verify or answer requests
            return [
                [{
                    // header icon for 'verify box'.
                    name: (this.state.request === "verify box" ? "verifying" : "verify box"),
                    onClick: () => {
                        if (this.state.selectedBox && !this.state.request) {
                            this.setState({request: "verify box"});
                            this.props.solver.verify().box(this.state.selectedBox,
                                (result) => {
                                    if (result.answer) {
                                        this.state.selectedBox.markValid();
                                    } else {
                                        this.state.selectedBox.markInvalid();
                                    }
                                    this.setState({request: null});
                                },
                                (error) => {
                                    this.setState({request: null});
                                });
                        }
                    },
                    isClicked: this.state.request === "verify box",
                    color: (this.state.request || !this.state.selectedBox ? "BDBDBD" : null),
                    icon: 'check_box'
                },{
                    // header icon for 'verify clue'
                    name: (this.state.request === "verify clue" ? "verifying" : "verify clue"),
                    onClick: () => {
                        let clue = this.getSelectedClue();
                        if (clue && !this.state.request) {
                            this.setState({request: "verify clue"});
                            let answer = this.state.puzzle[clue.direction][clue.number].map(
                                (box) => {
                                    return box.value;
                                });
                            this.props.solver.verify().clue({
                                    direction: clue.direction,
                                    number: clue.number,
                                    answer: answer
                                },
                                (result) => {
                                    if (result.answer) {
                                        for (let i = 0; i < result.answer.length; i++) {
                                            if (result.answer[i]) {
                                                this.state.puzzle[clue.direction][clue.number][i].markValid();
                                            } else {
                                                this.state.puzzle[clue.direction][clue.number][i].markInvalid();
                                            }
                                        }
                                    }
                                    this.setState({request: null});
                                },
                                (error) => {
                                    this.setState({request: null});
                                });
                        }
                    },
                    isClicked: this.state.request === "verify clue",
                    color: (this.state.request || !this.getSelectedClue() ? "BDBDBD" : null),
                    icon: 'more_horiz'
                },{
                    // header icon for 'verify board'
                    name: (this.state.request === "verify board" ? "verifying" : "verify board"),
                    onClick: () => {
                        if (!this.state.request) {
                            this.setState({request: "verify board"});
                            this.props.solver.verify().puzzle(this.state.board, (result) => {
                                if (result.answer) {
                                    for (let y = 0; y < result.answer.length; y++) {
                                        for (let x = 0; x < result.answer[y].length; x++) {
                                            if (!this.state.board.get(x, y).isBlackBox()) {
                                                if (result.answer[y][x]) {
                                                    this.state.board.get(x,y).markValid();
                                                } else {
                                                    this.state.board.get(x,y).markInvalid();
                                                }
                                            }
                                        }
                                    }
                                    this.setState({request: null});
                                }
                            }, (error) => {
                                this.setState({request: null});
                            });
                        }
                    },
                    isClicked: this.state.request === "verify board",
                    color: (this.state.request ? "BDBDBD" : null),
                    icon: 'view_comfy'
                }],[{
                    // header icon for 'reveal box'
                    name: (this.state.request === "reveal box" ? "revealing" : "reveal box"),
                    onClick: () => {
                        if (!this.state.request && this.state.selectedBox) {
                            this.setState({request: "reveal box"});
                            this.props.solver.answer().box(this.state.selectedBox,
                                (result) => {
                                    if (result.answer) {
                                        this.state.selectedBox.set(result.answer);
                                        this.state.selectedBox.markValid();
                                    }
                                    this.setState({request: null});
                                }, (error) => {
                                    this.setState({request: null});
                                });
                        }
                    },
                    isClicked: this.state.request === "reveal box",
                    color: (this.state.request || !this.state.selectedBox ? "BDBDBD" : null),
                    icon: 'border_outer'
                },{
                    // header icon for 'reveal clue'
                    name: (this.state.request === "reveal clue" ? "revealing" : "reveal clue"),
                    onClick: () => {
                        let clue = this.getSelectedClue();
                        if (clue && !this.state.request) {
                            this.setState({request: "reveal clue"});
                            this.props.solver.answer().clue({
                                direction: clue.direction,
                                number: clue.number},
                                (result) => {
                                    if (result.answer) {
                                        for (let i = 0; i < result.answer.length; i++) {
                                            if (result.answer[i]) {
                                                this.state.puzzle[clue.direction][clue.number][i].set(result.answer[i]);
                                                this.state.puzzle[clue.direction][clue.number][i].markValid();
                                            }
                                        }
                                    }
                                    this.setState({request: null});
                                },
                                (error) => {
                                    this.setState({request: null});
                                });
                        }
                    },
                    isClicked: this.state.request === "reveal clue",
                    color: (this.state.request || !this.getSelectedClue() ? "BDBDBD" : null),
                    icon: 'select_all'
                },{
                    // header icon for 'reveal board'
                    name: (this.state.request === "reveal board" ? "revealing" : "reveal board"),
                    onClick: () => {
                        if (!this.state.request) {
                            this.setState({request: "reveal board"});
                            this.props.solver.answer().puzzle(this.state.board, (result) => {
                                if (result.answer) {
                                    for (let y = 0; y < result.answer.length; y++) {
                                        for (let x = 0; x < result.answer[y].length; x++) {
                                            if (!this.state.board.get(x, y).isBlackBox()) {
                                                if (result.answer[y][x]) {
                                                    this.state.board.get(x, y).set(result.answer[y][x]);
                                                    this.state.board.get(x, y).markValid();
                                                }
                                            }
                                        }
                                    }
                                    this.setState({request: null});
                                }
                            },(error) => {
                                this.setState({request: null});
                            });
                        }
                    },
                    isClicked: this.state.request === "reveal board",
                    color: (this.state.request ? "BDBDBD" : null),
                    icon: 'apps'
                }]
            ];
        }
        return [];
    }

    /**
     * Render the Crossword element.
     *
     * @returns {XML}
     */
    render() {
        return (<div>
            <CrosswordTitle data={this.props.metadata} />
            <CrosswordHeader headerItems={this.getHeaderItems()} itemWidth={65}/>
            <div className="crossword-container" >
                <div className="crossword-column-small" >
                    <CrosswordClues style={{marginRight: "25px", float: "right"}} type='across' onClick={this.handleClueClick} clues={this.state.clues.across} />
                </div>
                <div className="crossword-column-big" >
                    <CrosswordSelectedClue clue={this.getSelectedClue()} />
                    <CrosswordBoard onClick={this.handleBoxClick} board={this.state.board}/>
                    <CrosswordMetadata data={this.props.metadata} />
                </div>
                <div className="crossword-column-small" >
                    <CrosswordClues type='down' style={{marginLeft: "25px", float: "left"}} onClick={this.handleClueClick} clues={this.state.clues.down} />
                </div>
            </div>
        </div>);
    }
}

Crossword.propTypes = {
    game: React.PropTypes.instanceOf(Game).isRequired,
    metadata: React.PropTypes.instanceOf(Metadata),
    solver: React.PropTypes.object,
    onChange: React.PropTypes.func
};

module.exports = Crossword;