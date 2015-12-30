/**
 *
 * @author alex
 */

import React from 'react';
import './CrosswordTitle.css';

class CrosswordTitle extends React.Component {

    constructor(props) {
        super(props);
        this.DEFAULT_TITLE = "Untitled Crossword";
    }

    render() {
        return (<div className="crossword-title-container">
            <div className="title">
                <span>{this.props.data.title || this.DEFAULT_TITLE}</span>
            </div>
            {this.props.data ? (<div className="metadata">
                {(this.props.data.author) ?
                    (<div><span className="field">created by</span><span className="value">{this.props.data.author}</span></div>) : ""}
                {(this.props.data.editor) ?
                    (<div><span className="field">edited by</span><span className="value">{this.props.data.editor}</span></div>) : ""}
            </div>) : ""}
        </div>);
    }

}

module.exports = CrosswordTitle;