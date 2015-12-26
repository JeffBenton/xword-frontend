/**
 * Created by alex on 12/7/15.
 */

import React from 'react';
import './CrosswordHeaderItem.css';

class CrosswordHeaderItem extends React.Component {

    render() {
        return (
            <div className={'crossword-header-item' + (this.props.item.isClicked ? ' selected' : '')} onClick={this.props.item.onClick} style={{width: this.props.width + 'px'}}>
                <i className="material-icons">{this.props.item.icon}</i>
                <span className='item-description'>{this.props.item.name}</span>
            </div>
        );
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
    width: 48
}

module.exports = CrosswordHeaderItem;