/**
 * Created by alex on 11/28/15.
 */

import React from 'react';
import Clue from './../../objects/clue.js';

class CrosswordClue extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.clue);
    }

    render() {
        return (<div onClick={this.onClick}><b>{this.props.clue.number}</b> {this.props.clue.text}</div>);
    }
}

CrosswordClue.propTypes = {
    clue: React.PropTypes.instanceOf(Clue).isRequired,
    isEditing: React.PropTypes.bool
};

CrosswordClue.defaultProps = {
    isEditing: false
};

module.exports = CrosswordClue;