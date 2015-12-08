/**
 * Created by alex on 12/7/15.
 */

import React from 'react';
import Clue from './../../objects/clue.js';
import CrosswordClue from './CrosswordClue.js';

class EditableCrosswordClue extends CrosswordClue {

    constructor(props) {
        super(props);
        console.log('hi');
        this.state = {
            isEditing: false
        };
    }

    onClick() {
        if (this.props.clue.isSelected) {
            this.setState({isEditing: true});
        } else {
            this.props.onClick(this.props.clue);
        }
    }

    getEditingClueStyle() {
        return {};
    }

    render() {
        if (this.state.isEditing) {
            return (<div style={this.getEditingClueStyle()}><b>{this.props.clue.number}</b></div>);
        } else {
            return super.render();
        }
    }
}

EditableCrosswordClue.propTypes = {
    clue: React.PropTypes.instanceOf(Clue).isRequired,
};

module.exports = EditableCrosswordClue;