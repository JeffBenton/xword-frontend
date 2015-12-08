/**
 * Created by alex on 11/27/15.
 */

import React from 'react';
import CrosswordClue from './CrosswordClue.js';
import EditableCrosswordClue from './EditableCrosswordClue.js';

class CrosswordClues extends React.Component {

    render() {
        var clues = [];
        for (var number in this.props.clues) {
            if (this.props.clues.hasOwnProperty(number)) {
                if (this.props.mode == 'CREATE') {
                    clues.push(<EditableCrosswordClue clue={this.props.clues[number]} key={number} onClick={this.props.onClick}/>);
                } else {
                    clues.push(<CrosswordClue clue={this.props.clues[number]} key={number} onClick={this.props.onClick}/>);
                }
            }
        }
        return (
            <div>
                <h4>{this.props.type}</h4>
                {clues}
            </div>);
    }
}

CrosswordClues.propTypes = {
    type: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    clues: React.PropTypes.object.isRequired,
    mode: React.PropTypes.string.isRequired
};

module.exports = CrosswordClues;