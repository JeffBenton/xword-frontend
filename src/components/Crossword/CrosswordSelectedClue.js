/**
 *
 * @author alex
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './CrosswordSelectedClue.css';
import {realWidth, fitTextToContainer} from './../../objects/util.js';

class CrosswordSelectedClue extends React.Component {

    constructor(props) {
        super(props);
        this.handleWindowScroll = this.handleWindowScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            isFloating: false
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleWindowScroll);
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    }

    componentDidUpdate() {
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleWindowScroll);
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        if (!this.state.isFloating && this.hasClue()) {
            let text = ReactDOM.findDOMNode(this).getElementsByClassName("clue-text")[0];
            let name = ReactDOM.findDOMNode(this).getElementsByClassName("clue-name")[0];
            let container = ReactDOM.findDOMNode(this);
            let containerWidth = realWidth(container);
            let nameWidth = realWidth(name);

            text.style.width = (containerWidth - nameWidth) + 'px';
            text.style.fontSize = '18px';

            fitTextToContainer(text, container);
        }
    }

    handleWindowScroll() {
        let rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        if (!this.state.isFloating && (rect.bottom - (rect.height/2)  <= 0)) {
            this.setState({isFloating: true});
        } else if (this.state.isFloating && (rect.top + (rect.height/2) >= 0)) {
            this.setState({isFloating: false});
        }
    }

    hasClue() {
        return (this.props.clue !== null && this.props.clue.number && this.props.clue.direction);
    }

    render() {
        if (this.hasClue()) {
            let clueName = (
                <span className="clue-name">{this.props.clue.number + " " + this.props.clue.direction + " |"}</span>);
            let clueText = (<span className="clue-text">{this.props.clue.text ? this.props.clue.text : <i>(no clue text)</i>}</span>);
            if (this.state.isFloating) {
                let floatbar = <div className="crossword-selected-clue-container-floating">{clueName}{clueText}</div>;
                let element = (<div className={"crossword-selected-clue-container"}></div>);
                return (<div>
                    {floatbar}
                    {element}
                </div>);
            } else {
                return <div className={"crossword-selected-clue-container active" + (this.state.isFloating ? " ghost" : "")}>
                    {clueName}
                    {clueText}
                </div>;
            }
        } else {
            return (<div className={"crossword-selected-clue-container"}></div>);
        }

    }
}

module.exports = CrosswordSelectedClue;