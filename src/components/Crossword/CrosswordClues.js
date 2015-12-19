/**
 * Created by alex on 11/27/15.
 */

import React from 'react';
import CrosswordClue from './CrosswordClue.js';

class CrosswordClues extends React.Component {

    getCluesStyle() {
        return {
            WebkitColumnWidth: "150px",
            MozColumnWidth: "150px",
            columnWidth: "150px"
        };
    }

    getHeaderStyle() {
        return {
            WebkitColumnSpan: "all",
            columnSpan: "all"
        };
    }

    render() {
        var clues = [];
        for (var number in this.props.clues) {
            if (this.props.clues.hasOwnProperty(number)) {
                clues.push(<CrosswordClue clue={this.props.clues[number]} key={number} onClick={this.props.onClick}/>);
            }
        }
        return (
            <div style={this.getCluesStyle()}>
                <h4 style={this.getHeaderStyle()}>{this.props.type}</h4>
                {clues}
            </div>);
    }
}

CrosswordClues.propTypes = {
    type: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    clues: React.PropTypes.object.isRequired
};

module.exports = CrosswordClues;