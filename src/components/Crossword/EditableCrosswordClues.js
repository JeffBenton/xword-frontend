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
        this.onFinishEditing = this.onFinishEditing.bind(this);
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
            this.onFinishEditing(clue);
            this.props.onClick(clue);
        }
    }

    onFinishEditing(clue) {
        this.setState({
            editing: null
        });

        if (this.props.onUpdate) {
            this.props.onUpdate(clue);
        }
    }

    render() {
        var clues = [];
        for (var number in this.props.clues) {
            if (this.props.clues.hasOwnProperty(number)) {
                clues.push(<EditableCrosswordClue clue={this.props.clues[number]} key={number} onClick={this.onClick} isEditing={this.state.editing === this.props.clues[number]} onFinishEditing={this.onFinishEditing}/>);
            }
        }

        return (
            <div className="crossword-clues-container" style={this.props.style}>
                <h4>{this.props.type.toUpperCase()}</h4>
                {clues}
            </div>);
    }
}

EditableCrosswordClues.propTypes = {
    type: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    clues: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func
};

module.exports = EditableCrosswordClues;