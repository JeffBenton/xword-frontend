/**
 * Created by alex on 11/27/15.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import CrosswordBox from './CrosswordBox.js';
import Board from './../../objects/board.js';

import './CrosswordBoard.css';

class CrosswordBoard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 30 * this.props.board.height,
            width: 30 * this.props.board.width
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.setState({
           height: ReactDOM.findDOMNode(this).offsetWidth / this.props.board.width * this.props.board.height,
            width: ReactDOM.findDOMNode(this).offsetWidth
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.setState({
            height: ReactDOM.findDOMNode(this).offsetWidth / this.props.board.width * this.props.board.height,
            width: ReactDOM.findDOMNode(this).offsetWidth
        });
    }

    render() {
        var boxHeight = this.state.height / this.props.board.height;
        var boxWidth = this.state.width / this.props.board.width;
        var crosswordStyle = {
            height: this.state.height + 'px'
        };
        var crosswordBoardStyle = {
            height: this.state.height + 'px',
            width: this.state.width + 'px'
        };

        var crosswordRowStyle = {
            height: boxHeight + 'px',
            width: this.state.width + 'px'
        };

        return (
            <div className="crossword-board-container" style={crosswordStyle}>

            <div className='crossword-board' style={crosswordBoardStyle}>
            {this.props.board.board.map(function (row, index) {
                return (<div className='crossword-row' style={crosswordRowStyle} key={index}>
                    {row.map(function (box) {
                        return (<CrosswordBox
                            onClick={this.props.onClick}
                            box={box}
                            key={box.id}
                            height={boxHeight}
                            width={boxWidth}
                            maxHeight={this.props.board.height}
                            maxWidth={this.props.board.width}
                        />);
                    }, this)}
                </div>);
            }, this)}
            </div>
                </div>);
    }
}

CrosswordBoard.propTypes = {
    board: React.PropTypes.instanceOf(Board).isRequired,
    onClick: React.PropTypes.func.isRequired
};

module.exports = CrosswordBoard;