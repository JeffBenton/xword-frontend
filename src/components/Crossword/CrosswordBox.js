import React from 'react';
import Box from './../../objects/box.js';
import {boxState} from './../../objects/constants.js';
import './CrosswordBox.css';

class CrosswordBox extends React.Component {

    constructor(props) {
        super(props);
    }

    getBoxStyle() {
        let style = {
            height: this.props.height + 'px',
            width: this.props.width + 'px'
        };

        if (this.props.box.x === 0) {
            style.borderLeft = '2px solid black';
        }
        if (this.props.box.y === 0) {
            style.borderTop = '2px solid black';
        }
        if (this.props.box.x === this.props.maxWidth - 1) {
            style.borderRight = '2px solid black';
        }
        if (this.props.box.y === this.props.maxHeight - 1) {
            style.borderBottom = '2px solid black';
        }

        return style;
    }

    getNumberStyle() {
        return {
            fontSize: Math.floor(this.props.height/3.5) + 'px'
        };
    }

    getValueStyle() {
        return {
            fontSize: Math.floor(this.props.height/2) + 2 + 'px',
            lineHeight: this.props.height + 'px'
        };
    }

    render() {
        var boxStyle = this.getBoxStyle();
        var numberStyle = this.getNumberStyle();
        var valueStyle = this.getValueStyle();
        var onClick = (function(that) {
            return function() {that.props.onClick(that.props.box);};
        })(this);
        var clueNumber = null;
        var value = this.props.box.value !== null ? (
            <div className='value' style={valueStyle}>
                {this.props.box.value}
            </div>
        ) : null;

        if (this.props.box.isBlackBox()) {
            // do nothing
        } else if (this.props.box.across !== null && this.props.box.across.char === 0) {
            clueNumber = (
                <div className='number' style={numberStyle}>
                    {this.props.box.across.clue}
                </div>);
        } else if (this.props.box.down !== null && this.props.box.down.char === 0) {
            clueNumber = (
                <div className='number' style={numberStyle}>
                    {this.props.box.down.clue}
                </div>);
        }

        return (
            <div className={'crossword-box ' + 'crossword-box-' + this.props.box.state.toLowerCase()} style={boxStyle} onClick={onClick}>
                {clueNumber}
                {value}
            </div>);
    }
}


CrosswordBox.propTypes = {
    box: React.PropTypes.instanceOf(Box).isRequired,
    onClick: React.PropTypes.func.isRequired,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    maxHeight: React.PropTypes.number.isRequired,
    maxWidth: React.PropTypes.number.isRequired
};

CrosswordBox.defaultProps = {
    height: 30,
    width: 30
};

module.exports = CrosswordBox;