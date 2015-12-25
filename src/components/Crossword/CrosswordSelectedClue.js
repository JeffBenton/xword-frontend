/**
 *
 * @author alex
 */

import React from 'react';
import './CrosswordSelectedClue.css';

class CrosswordSelectedClue extends React.Component {

    render() {
        if (this.props.clue !== null && this.props.clue.number && this.props.clue.direction) {
            let clueName = (
                <span className="clue-name">{this.props.clue.number + " " + this.props.clue.direction + " |"}</span>);
            let clueText = (<span className="clue-text">{this.props.clue.text ? this.props.clue.text : <i>(no clue text)</i>}</span>);
            return (
                <div className={"crossword-selected-clue-container active"}>
                    {clueName}
                    {clueText}
                </div>);
        } else {
            return (<div className={"crossword-selected-clue-container"}></div>);
        }

    }
}

module.exports = CrosswordSelectedClue;