import React from 'react';
import Box from './../../objects/box.js';
import {boxState} from './../../util/constants.js';
import {fitTextToContainer} from './../../util/util.js';
import './CrosswordBox.css';

class CrosswordBox extends React.Component {

    constructor(props) {
        super(props);
    }

    getBoxStyle() {
        let style = {
            height: this.props.height + 'px',
            width: this.props.width + 'px',
            color: '#' + this.props.box.color
        };

        if (this.props.box.attributes && this.props.box.attributes.color && this.props.box.state === boxState.NORMAL) {
            style.backgroundColor = '#' + this.props.box.attributes.color;
        }

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
        let length = this.props.box.value ? Math.max(1, this.props.box.value.length * 9/16) : 1;
        return {
            fontSize: (Math.floor(this.props.height/2) + 2) / length + 'px',
            lineHeight: this.props.height + 'px'
        };
    }

    addShape(shape, value) {
        return  <div>
                    <div className={shape}
                         style={
                            {height: (this.props.height - 8) + 'px',
                             width: (this.props.width - 8) + 'px',
                             margin: '3px'}
                             }>
                    </div>
                    {value}
                </div>;
    }

    render() {
        var boxStyle = this.getBoxStyle();
        var numberStyle = this.getNumberStyle();
        var valueStyle = this.getValueStyle();
        var onClick = () => {
            this.props.onClick(this.props.box);
        };
        var clueNumber = null;
        var value = !this.props.box.isBlackBox() ? (
            <div className='value' style={valueStyle}>
                {this.props.box.value != null ? this.props.box.value : " "}
            </div>
        ) : null;

        if (value && this.props.box.attributes && this.props.box.attributes.shape) {
            value = this.addShape(this.props.box.attributes.shape, value);
        }

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