/**
 * Created by alex on 12/7/15.
 */

import React from 'react';
import Clue from './../../objects/clue.js';
import CrosswordClue from './CrosswordClue.js';

class EditableCrosswordClue extends CrosswordClue {

    constructor(props) {
        super(props);
        this.clue = this.props.clue;
        this.state = {
            value: this.props.clue.text
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(props) {
        this.state = {
            value: props.clue.text
        };
        this.clue = props.clue;
    }

    getEditingClueStyle() {
        return {};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        this.clue.text = event.target.value;
    }

    render() {
        var value = this.state.value;
        if (this.props.isEditing) {
            return (<div style={this.getEditingClueStyle()}><b>{this.props.clue.number}</b><input type="text" ref="edit" value={value} onChange={this.handleChange} /></div>);
        } else {
            return super.render();
        }
    }

    componentDidUpdate() {
        if (this.props.isEditing) {
            console.log('update');
            this.refs.edit.focus();
        }
    }
}

EditableCrosswordClue.propTypes = {
    clue: React.PropTypes.instanceOf(Clue).isRequired,
    isEditing: React.PropTypes.bool
};

module.exports = EditableCrosswordClue;