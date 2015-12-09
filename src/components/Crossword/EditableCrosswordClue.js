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
            value: this.props.clue.text,
            isEditing: this.props.isEditing
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    componentWillReceiveProps(props) {
        this.state = {
            value: props.clue.text,
            isEditing: props.isEditing
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

    handleKeydown(event) {
        if (event.which == 13) {
            this.setState({isEditing: false});
        }
    }

    render() {
        var value = this.state.value;
        if (this.state.isEditing) {
            return (<div style={this.getEditingClueStyle()}><b>{this.props.clue.number}</b><input type="text" ref="edit" value={value} onChange={this.handleChange} onKeyDown={this.handleKeydown}/></div>);
        } else {
            return super.render();
        }
    }

    componentDidUpdate() {
        if (this.state.isEditing) {
            this.refs.edit.focus();

            // hack to always put the cursor at the end of the value
            let val = this.refs.edit.value;
            this.refs.edit.value = "";
            this.refs.edit.value = val;
        }
    }
}

EditableCrosswordClue.propTypes = {
    clue: React.PropTypes.instanceOf(Clue).isRequired,
    isEditing: React.PropTypes.bool
};

module.exports = EditableCrosswordClue;