import React from 'react';
import CrosswordBoard from './../Crossword/CrosswordBoard.js';
import CrosswordClues from './../Crossword/CrosswordClues.js';
import Game from './../../objects/game.js';
import Clue from './../../objects/clue.js';

class Crossword extends React.Component {

    constructor(props) {
        super(props);
        this.game = new Game(props.width, props.height);

        this.state = {
            board: this.game.board,
            puzzle: this.game.puzzle,
            clues: this.game.clues,
            selected: null
        };

        this.handleBoxClick = this.handleBoxClick.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }


    handleBoxClick(box) {
        switch (this.props.mode) {
            case 'EDIT':
                this.game.toggleBoxStatus(box.x, box.y);
                this.setState(
                    {
                        board: this.game.board,
                        puzzle: this.game.puzzle,
                        clues: this.game.clues
                    }
                );
                break;
            case 'SOLVE':
                // should select the clue we clicked on
                break;
        }

    }

    handleKeypress(key) {
        console.log(key);
    }

    handleClueClick(clue) {
        console.log(clue);
    }

    render() {
        return (<div className="crossword-container">
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
    width: 4,
    height: 4,
    mode: 'EDIT'
};

module.exports = Crossword;