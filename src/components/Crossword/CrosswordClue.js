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

    getClueStyle() {
        if (this.props.clue.isSelected) {
            return {
                fontFamily: "'Open Sans', sans-serif",
                fontSize: "13px",
                backgroundColor: '#E4E4F8'
            }
        } else {
            return {
                fontFamily: "'Open Sans', sans-serif",
                fontSize: "13px"
            };
        }
    }

    render() {
        var clueStyle = this.getClueStyle();
        return (<div style={clueStyle} onClick={this.onClick}><b>{this.props.clue.number}</b> {this.props.clue.text}</div>);
    }
}

CrosswordClue.propTypes = {
    clue: React.PropTypes.instanceOf(Clue).isRequired
};

module.exports = CrosswordClue;