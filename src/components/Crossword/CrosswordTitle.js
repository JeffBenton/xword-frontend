import React from 'react';
import Metadata from './../../objects/metadata.js';
import './CrosswordTitle.css';

/**
 * The CrosswordTitle component. Displays the title of this crossword puzzle, with 'created by' and 'edited by'
 * subtitles.
 *
 * props:
 *      data - Metadata - the metadata object for this Crossword. used to show the title/author/editor.
 *      defaultTitle - string - the placeholder string to display if there's no title. default: 'Untitled Crossword'
 */
class CrosswordTitle extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Render the CrosswordTitle element.
     *
     * @returns {XML}
     */
    render() {
        return (<div className="crossword-title-container">
            <div className="title">
                <span>{this.props.data.title || this.props.defaultTitle}</span>
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

CrosswordTitle.propTypes = {
    defaultTitle: React.PropTypes.string,
    data: React.PropTypes.instanceOf(Metadata).isRequired
};

CrosswordTitle.defaultProps = {
    defaultTitle: "Untitled Crossword"
};

module.exports = CrosswordTitle;