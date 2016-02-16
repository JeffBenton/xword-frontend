import React from 'react';
import CrosswordBoard from './CrosswordBoard.js';
import CrosswordClues from './CrosswordClues.js';
import CrosswordHeader from './CrosswordHeader.js';
import CrosswordSelectedClue from './CrosswordSelectedClue.js';
import CrosswordTitle from './CrosswordTitle.js';
import CrosswordMetadata from './CrosswordMetadata.js';
import Game from './../../objects/game.js';
import Clue from './../../objects/clue.js';
import {directions, boxState} from './../../util/constants.js';
import {otherDirection, toLetter, once} from './../../util/util.js';
import './Crossword.css';

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

    handleKeyup(event) {
        if (event.which == 16) {
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
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
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

            if (event.shiftKey) {
                selectedBox.set(selectedBox.get() + char);
                this.selectBox(selectedBox);
                if (!this.state.shift) {
                    this.setState({shift: true});
                    window.addEventListener('keyup', this.handleKeyup);
                }
            } else {
                selectedBox.set(char);
                selectedBox = this.props.game.nextInputBox(selectedBox, selectedClue.focused);
                this.selectBox(selectedBox);
            }

            if (this.props.onChange) {
                console.log('box value changed!!');
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

                if (!selectedBox.value) {
                    selectedBox = this.props.game.previousInputBox(selectedBox, selected.focused);
                }

                selectedBox.clearValue();
                this.selectBox(selectedBox);

                if (this.props.onChange) {
                    this.props.onChange();
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
                        this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'down'), 'down');
                    }
                } else if (selected.down && selected.focused === 'down') {
                    this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'down'));
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
                        this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'across'), 'across');
                    }
                } else if (selected.across && selected.focused === 'across') {
                    this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'across'));
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
                        this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'down'), 'down');
                    }
                } else if (selected.down && selected.focused === 'down') {
                    this.selectBox(this.props.game.nextNavigateBox(selectedBox, 'down'));
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
                        this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'across'), 'across');
                    }
                } else if (selected.across && selected.focused === 'across') {
                    this.selectBox(this.props.game.previousNavigateBox(selectedBox, 'across'));
                }
                break;

        }
    }

    selectBox(box, direction) {
        if (box === null || box.isBlackBox() || (this.state.selectedBox == box
                                                    && direction == this.state.selectedClue.focused)) {
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
        if (this.props.solver) {
            return [
                [{
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
            ];//  for reveal box
        }
        return [];
    }

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
    solver: React.PropTypes.object
};

module.exports = Crossword;