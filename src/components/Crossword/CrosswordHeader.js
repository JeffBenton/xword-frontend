/**
 * Created by alex on 12/4/15.
 */

import React from 'react';
import CrosswordHeaderItem from './CrosswordHeaderItem.js'
class CrosswordHeader extends React.Component {

    render() {
        return (<div>{this.props.headerItems.map(function(value, i) {
            return <CrosswordHeaderItem key={i} item={value} />
        })}</div>);
    }
}

CrosswordHeader.propTypes = {
    headerItems: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string,
        onClick: React.PropTypes.func,
        isClicked: React.PropTypes.bool
    })).isRequired
};

module.exports = CrosswordHeader;