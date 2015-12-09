/**
 * Created by alex on 12/7/15.
 */

import React from 'react';
class CrosswordHeaderItem extends React.Component {

    render() {
        if (this.props.item.isClicked) {
            return (<div onClick={this.props.item.onClick}>{this.props.item.name}</div>);
        } else {
            return (<div onClick={this.props.item.onClick}><a>{this.props.item.name}</a></div>);
        }
    }
}

CrosswordHeaderItem.propTypes = {
    item: React.PropTypes.shape({
        name: React.PropTypes.string,
        onClick: React.PropTypes.func,
        isClicked: React.PropTypes.bool
    })
};

module.exports = CrosswordHeaderItem;