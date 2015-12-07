/**
 * Created by alex on 12/7/15.
 */

import React from 'react';
class CrosswordHeaderItem extends React.Component {

    render() {
        return (<div onClick={this.props.item.onClick}>{this.props.item.name}</div>);
    }
}

CrosswordHeaderItem.propTypes = {
    item: React.PropTypes.shape({
        name: React.PropTypes.string,
        onClick: React.PropTypes.func
    })
};

module.exports = CrosswordHeaderItem;