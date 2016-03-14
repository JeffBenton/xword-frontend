/**
 * Created by alex on 12/4/15.
 */

import React from 'react';
import CrosswordHeaderItem from './CrosswordHeaderItem.js';
import './CrosswordHeader.css';

class CrosswordHeader extends React.Component {


    render() {
        let getGroupStyle = (index) => {
            if (index === 0) {
                return {textAlign: 'left'};
            } else if (this.props.headerItems.length === 1) {
                return {textAlign: 'right'};
            } else if (index === this.props.headerItems.length - 1) {
                return {textAlign: 'right'};
            } else {
                return {textAlign: 'center'};
            }
        };

        var elements = [];
        for (let i = 0; i < this.props.headerItems.length; i++) {
            elements.push(<td key={i} style={getGroupStyle(i, this.props.headerItems.length)}>{
                this.props.headerItems[i].map(function(value, index) {
                return <CrosswordHeaderItem key={i + "-" + index} item={value} width={this.props.itemWidth}/>
            }, this)}</td>);
        }
        return (<div className="crossword-header">
            <div className="crossword-column-small" ></div>
            <div className="crossword-column-big" >
                <div className="crossword-header-items-container">
                    <table><tbody><tr>
                        {elements}
                    </tr></tbody></table>
                </div>
            </div>
            <div className="crossword-column-small" ></div>
        </div>);
    }
}

CrosswordHeader.propTypes = {
    headerItems: React.PropTypes.array.isRequired,
    itemWidth: React.PropTypes.number
};

CrosswordHeader.defaultProps = {
    itemWidth: 48
}

module.exports = CrosswordHeader;