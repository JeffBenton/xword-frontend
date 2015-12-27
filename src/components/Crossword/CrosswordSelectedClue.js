/**
 *
 * @author alex
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './CrosswordSelectedClue.css';

class CrosswordSelectedClue extends React.Component {

    constructor(props) {
        super(props);
        this.handleWindowScroll = this.handleWindowScroll.bind(this);
        this.state = {
            isFloating: false
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleWindowScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleWindowScroll);
    }

    handleWindowScroll() {
        let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        if (!this.state.isFloating && (rect.bottom - (rect.height/2)  <= 0)) {
            this.setState({isFloating: true});
        } else if (this.state.isFloating && (rect.top + (rect.height/2) >= 0)) {
            this.setState({isFloating: false});
        }
    }

    render() {
        if (this.props.clue !== null && this.props.clue.number && this.props.clue.direction) {
            let clueName = (
                <span className="clue-name">{this.props.clue.number + " " + this.props.clue.direction + " |"}</span>);
            let clueText = (<span className="clue-text">{this.props.clue.text ? this.props.clue.text : <i>(no clue text)</i>}</span>);
            let element = <div className={"crossword-selected-clue-container active" + (this.state.isFloating ? " ghost" : "")}>
                {clueName}
                {clueText}
            </div>;
            if (this.state.isFloating) {
                let floatbar = <div className="crossword-selected-clue-container-floating">{clueName}{clueText}</div>;
                return (<div>
                    {floatbar}
                    {element}
                </div>);
            } else {
                return element;
            }
        } else {
            return (<div className={"crossword-selected-clue-container"}></div>);
        }

    }
}

module.exports = CrosswordSelectedClue;