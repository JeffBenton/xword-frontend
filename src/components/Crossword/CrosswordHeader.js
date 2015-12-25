/**
 * Created by alex on 12/4/15.
 */

import React from 'react';
import CrosswordHeaderItem from './CrosswordHeaderItem.js';
import CrosswordHeaderDivider from './CrosswordHeaderDivider.js';
import './CrosswordHeader.css';

class CrosswordHeader extends React.Component {

    render() {
        var elements = [];
        for (let i = 0; i < this.props.headerItems.length; i++) {
            elements = elements.concat(this.props.headerItems[i].map(function(value, index) {
                return <CrosswordHeaderItem key={i + "-" + index} item={value} />
            }, this));
            if (i < this.props.headerItems.length - 1) {
                elements.push(<CrosswordHeaderDivider key={i + "-d"}/>);
            }
        }
        return (<div className="crossword-board-header">{elements}</div>);
    }
}

CrosswordHeader.propTypes = {
    headerItems: React.PropTypes.array.isRequired
};

module.exports = CrosswordHeader;