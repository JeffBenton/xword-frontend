/**
 * Created by alex on 11/28/15.
 */

import React from 'react';
import Clue from './../../objects/clue.js';
import './CrosswordClue.css';

class CrosswordClue extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.clue);
    }

    render() {
        return (<div className={"crossword-clue" + (this.props.clue.isSelected ? " selected" : "")} onClick={this.onClick}><b>{this.props.clue.number}</b> {this.props.clue.text}</div>);
    }
}

CrosswordClue.propTypes = {
    clue: React.PropTypes.instanceOf(Clue).isRequired
};

module.exports = CrosswordClue;