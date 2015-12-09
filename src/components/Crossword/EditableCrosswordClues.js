/**
 * Created by alex on 11/27/15.
 */

import React from 'react';
import CrosswordClues from './CrosswordClues.js';
import EditableCrosswordClue from './EditableCrosswordClue.js';

class EditableCrosswordClues extends CrosswordClues {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.state = {
            editing: null
        };
    }

    onClick(clue) {
        if (clue.isSelected) {
            this.setState({
                editing: clue
            });
        } else {
            this.props.onClick(clue);
            this.setState({
                editing: null
            });
        }
    }

    render() {
        var clues = [];
        for (var number in this.props.clues) {
            if (this.props.clues.hasOwnProperty(number)) {
                clues.push(<EditableCrosswordClue clue={this.props.clues[number]} key={number} onClick={this.onClick} isEditing={this.state.editing == this.props.clues[number]}/>);
            }
        }
        return (
            <div>
                <h4>{this.props.type}</h4>
                {clues}
            </div>);
    }
}

EditableCrosswordClues.propTypes = {
    type: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    clues: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string.isRequired
};

module.exports = EditableCrosswordClues;