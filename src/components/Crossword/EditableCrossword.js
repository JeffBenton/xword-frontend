/**
 * Created by alex on 12/9/15.
 */

import React from 'react';
import Game from './../../objects/game.js';
import Crossword from './Crossword.js';
import CrosswordBoard from './CrosswordBoard.js';
import CrosswordHeader from './CrosswordHeader.js';

import EditableCrosswordClues from './EditableCrosswordClues.js';

class EditableCrossword extends Crossword {

    constructor(props) {
        super(props);
        this.state.clickAction = "CREATEBOX";
    }

    handleBoxClick(box) {
        switch (this.state.clickAction) {
            case 'CREATEBOX':
                this.props.game.toggleBoxStatus(box.x, box.y);
                this.setState(
                    {
                        board: this.props.game.board,
                        puzzle: this.props.game.puzzle,
                        clues: this.props.game.clues,
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
    }

    getHeaderItems() {
        return [{
            name: "create",
            onClick: function(context) {
                return function() {
                    context.setState({clickAction: 'CREATEBOX'});
                };
            }(this),
            isClicked: this.state.clickAction === 'CREATEBOX'
        },
            {
                name: "select",
                onClick: function(context) {
                    return function() {
                        context.setState({clickAction: 'SELECT'});
                    };
                }(this),
                isClicked: this.state.clickAction === 'SELECT'
            }];
    }

    render() {
        console.log(this.props);
        return (<div className="crossword-container" >
            <div className="crossword-board-header"><CrosswordHeader headerItems={this.getHeaderItems()}/></div>
            <div className="crossword-board-container"><CrosswordBoard onClick={this.handleBoxClick}
                                                                       board={this.state.board}/></div>
            <div className="crossword-clues-container">
                <EditableCrosswordClues type='across' onClick={this.handleClueClick} clues={this.state.clues.across} />
                <EditableCrosswordClues type='down' onClick={this.handleClueClick} clues={this.state.clues.down} />
            </div>
        </div>);
    }
}

EditableCrossword.propTypes = {
    game: React.PropTypes.instanceOf(Game).isRequired
};

module.exports = EditableCrossword;