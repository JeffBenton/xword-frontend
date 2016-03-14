import React from 'react';
import Box from './../../objects/box.js';
import {directions, boxState} from './../../util/constants.js';
import {fitTextToContainer} from './../../util/util.js';
import classNames from 'classnames';
import './CrosswordBox.css';

/**
 * An individual crossword box element. Responsible for displaying information contained in the corresponding
 * Box object.
 *
 * props:
 *      box - Box - a Box object
 *      onClick - function - function to call if a box gets clicked
 *      height - number - the height of this box, in px
 *      width - number - the width of this box, in px
 *      maxX - number - the width of the game board
 *      maxY - number - the height of the game board
 */
class CrosswordBox extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Determine the styling for this box, based on the box attributes.
     *
     * @returns {{height: string, width: string, color: string}}
     */
    getBoxStyle() {
        let style = {
            height: this.props.height + 'px',
            width: this.props.width + 'px',
            color: '#' + this.props.box.color
        };

        // support boxes with different color, as defined in the box attributes
        if (this.props.box.attributes && this.props.box.attributes.color && this.props.box.state === boxState.NORMAL) {
            style.backgroundColor = '#' + this.props.box.attributes.color;
        }

        // if this box is on the edge of the game board, render a thicker border.
        if (this.props.box.x === 0) {
            style.borderLeft = '2px solid black';
        }
        if (this.props.box.y === 0) {
            style.borderTop = '2px solid black';
        }
        if (this.props.box.x === this.props.maxX - 1) {
            style.borderRight = '2px solid black';
        }
        if (this.props.box.y === this.props.maxY - 1) {
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

    /**
     * Support surrounding the box value with a shape, as defined in the box attributes.
     *
     * @param shape the shape to use
     * @param value the value div element
     * @returns {XML} the value surrounded by a shape
     */
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

    /**
     * Render the CrosswordBox element.
     *
     * @returns {XML}
     */
    render() {
        var clueNumber = null;
        var value = null;

        if (!this.props.box.isBlackBox()) {
            // if the box isn't a black box, create the value element
            value = <div className='value' style={this.getValueStyle()}>
                        {this.props.box.value != null ? this.props.box.value : " "}
                    </div>;
            if (this.props.box.attributes && this.props.box.attributes.shape) {
                value = this.addShape(this.props.box.attributes.shape, value);
            }

            // is this box the first box in a clue? if it is, it needs a clue number
            clueNumber = (() => {
                // check across and down clues
                for (let i in directions) {
                    if (directions.hasOwnProperty(i)) {
                        let dir = directions[i];
                        if (this.props.box[dir] !== null && this.props.box[dir].char === 0) {
                            // this is the first box in a clue! return the clue number div
                            return  <div className="number" style={this.getNumberStyle()}>
                                        {this.props.box[dir].clue}
                                    </div>;
                        }
                    }
                }
                // if it isn't the first box in a clue, return null.
                return null;
            })();
        }

        return (
            <div className={classNames(['crossword-box','crossword-box-' + this.props.box.state.toLowerCase()])}
                 style={this.getBoxStyle()}
                 onClick={() => {
                    this.props.onClick(this.props.box);
                }}>
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
    maxY: React.PropTypes.number.isRequired,
    maxX: React.PropTypes.number.isRequired
};

CrosswordBox.defaultProps = {
    height: 30,
    width: 30
};

module.exports = CrosswordBox;