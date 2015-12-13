/**
 * Created by alex on 12/7/15.
 */

import React from 'react';
class CrosswordHeaderItem extends React.Component {

    getSelectedStyle() {
        return {
            color: 'rgba(0,0,0,.34)',
            width: this.props.width + 'px',
            display: "inline-flex",
            cursor: "default"
        };
    }

    getStyle() {
        return {
            width: this.props.width + 'px',
            display: "inline-flex",
            cursor: "pointer"
        };
    }

    render() {
        if (this.props.item.isClicked) {
            return (<div onClick={this.props.item.onClick} style={this.getSelectedStyle()}><i className="material-icons">{this.props.item.icon}</i></div>);
        } else {
            return (<div onClick={this.props.item.onClick} style={this.getStyle()}><i className="material-icons">{this.props.item.icon}</i></div>);
        }
    }
}

CrosswordHeaderItem.propTypes = {
    item: React.PropTypes.shape({
        name: React.PropTypes.string,
        onClick: React.PropTypes.func,
        isClicked: React.PropTypes.bool,
        icon: React.PropTypes.string
    }).isRequired,
    width: React.PropTypes.number
};

CrosswordHeaderItem.defaultProps = {
    width: 30
}

module.exports = CrosswordHeaderItem;