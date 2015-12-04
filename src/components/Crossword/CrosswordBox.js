import React from 'react';
import Box from './../../objects/box.js';
import {boxState} from './../../objects/constants.js';

class CrosswordBox extends React.Component {

    constructor(props) {
        super(props);
    }

    getBoxStyle() {
        switch (this.props.box.state) {
            case boxState.NORMAL:
                return {
                    height: this.props.size + 'px',
                    width: this.props.size + 'px',
                    border: '1px black solid'
                };
            case boxState.FOCUSED:
                return {
                    height: this.props.size + 'px',
                    width: this.props.size + 'px',
                    border: '1px black solid',
                    backgroundColor: '#CBCBFF'
                };
            case boxState.SELECTED:
                return {
                    height: this.props.size + 'px',
                    width: this.props.size + 'px',
                    border: '1px black solid',
                    backgroundColor: '#EBEBEB'
                };
            case boxState.ACTIVE:
                return {
                    height: this.props.size + 'px',
                    width: this.props.size + 'px',
                    border: '1px black solid',
                    backgroundColor: '#FFF0CB'
                };
            case boxState.BLACKBOX:
                return {
                    height: this.props.size + 'px',
                    width: this.props.size + 'px',
                    border: '1px black solid',
                    backgroundColor: 'black'
                };
        }
    }

    getNumberStyle() {
        return {
            fontSize: Math.floor(this.props.size/3.3) + 'px',
            padding: '1px',
            position: 'absolute'
        };
    }

    getValueStyle() {
        return {
            lineHeight: this.props.size + 'px',
            textAlign: 'center'
        };
    }

    render() {
        var boxStyle = this.getBoxStyle();
        var numberStyle = this.getNumberStyle();
        var valueStyle = this.getValueStyle();
        var onClick = (function(that) {
            return function() {that.props.onClick(that.props.box)};
        })(this);
        var clueNumber = null;
        var value = this.props.box.value != null ? (
            <div style={valueStyle}>
                {this.props.box.value}
            </div>
        ) : null;

        if (this.props.box.isBlackBox()) {
            // do nothing
        } else if (this.props.box.across != null && this.props.box.across.char === 0) {
            clueNumber = (
                <div style={numberStyle}>
                    {this.props.box.across.clue}
                </div>);
        } else if (this.props.box.down != null && this.props.box.down.char === 0) {
            clueNumber = (
                <div style={numberStyle}>
                    {this.props.box.down.clue}
                </div>);
        }

        return (<div style={boxStyle} onClick={onClick}>
            {clueNumber}
            {value}
        </div>);
    }
}


CrosswordBox.propTypes = {
    box: React.PropTypes.instanceOf(Box).isRequired,
    onClick: React.PropTypes.func.isRequired,
    size: React.PropTypes.number
};

CrosswordBox.defaultProps = {
    size: 30
};

module.exports = CrosswordBox;