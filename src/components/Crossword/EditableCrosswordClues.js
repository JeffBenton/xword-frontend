/**
 * Created by alex on 11/27/15.
 */

import React from 'react';
import CrosswordClues from './CrosswordClues.js';
import EditableCrosswordClue from './EditableCrosswordClue.js';
import EditableCrosswordCluesModal from './EditableCrosswordCluesModal.js';

class EditableCrosswordClues extends CrosswordClues {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onFinishEditing = this.onFinishEditing.bind(this);
        this.onNavigateClue = this.onNavigateClue.bind(this);
        this.onHeaderClick = this.onHeaderClick.bind(this);
        this.onBulkClueUpdate = this.onBulkClueUpdate.bind(this);
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

    onNavigateClue(clue, direction) {
        switch (direction) {
            case 'up':
                this.onFinishEditing(clue);
                for (var upNumber in this.props.clues) {
                    if (this.props.clues.hasOwnProperty(upNumber)) {
                        if (upNumber > clue.number) {
                            this.setState({
                                editing: this.props.clues[upNumber]
                            });
                            this.props.onClick(this.props.clues[upNumber]);
                            return;
                        }
                    }
                }
                break;
            case 'down':
                this.onFinishEditing(clue);
                for (var downNumber = clue.number - 1; downNumber > 0; downNumber --) {
                    if (this.props.clues[downNumber]) {
                        this.setState({
                            editing: this.props.clues[downNumber]
                        });
                        this.props.onClick(this.props.clues[downNumber]);
                        return;
                    }
                }
                break;
            case 'default':
                this.onFinishEditing(clue);
                break;
        }
    }

    onHeaderClick(event) {
        if (this.state.editing) {
            this.onFinishEditing(this.state.editing);
            this.props.onClick(this.state.editing);
        }
        this.setState({
            modal: true
        });

    }

    onBulkClueUpdate(clues) {
        if (clues) {
            Object.keys(clues).forEach((key) => {
                this.props.clues[key].text = clues[key];
                this.props.onUpdate(this.props.clues[key]);
            });
        }
        this.setState({
            modal: false
        });
    }

    render() {
        var clues = [];
        for (var number in this.props.clues) {
            if (this.props.clues.hasOwnProperty(number)) {
                clues.push(<EditableCrosswordClue clue={this.props.clues[number]} key={number} onClick={this.onClick} isEditing={this.state.editing === this.props.clues[number]} onFinishEditing={this.onFinishEditing} onNavigateClue={this.onNavigateClue} />);
            }
        }

        return (
            <div className="crossword-clues-container" style={this.props.style}>
                {this.state.modal ? <EditableCrosswordCluesModal submit={this.onBulkClueUpdate} direction={this.props.type} clues={this.props.clues} dismissModal={() => {this.setState({modal: false});}} /> : ""}
                <h4 onClick={this.onHeaderClick}>{this.props.type.toUpperCase()}</h4>
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