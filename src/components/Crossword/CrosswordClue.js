/**
 * Created by alex on 11/28/15.
 */

import React from 'react';

class CrosswordClue extends React.Component {

    render() {
        return (<div><b>{this.props.clue.number}</b> {this.props.clue.text}</div>);
    }
}

module.exports = CrosswordClue;