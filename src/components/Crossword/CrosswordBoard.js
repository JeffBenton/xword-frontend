/**
 * Created by alex on 11/27/15.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import CrosswordBox from './CrosswordBox.js';
import Board from './../../objects/board.js';

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
            height: this.state.height + 'px',
            width: '100%',
            border: '2px black solid',
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box"
        };
        var crosswordRowStyle = {
            height: boxHeight + 'px',
            width: '100%',
            display: 'flex'
        };

        return (<div className='crossword' style={crosswordStyle}>
            {this.props.board.board.map(function (row, index) {
                return (<div className='crossword-row' style={crosswordRowStyle} key={index}>
                    {row.map(function (box) {
                        return (<CrosswordBox onClick={this.props.onClick} box={box} key={box.id} height={boxHeight} width={boxWidth}/>);
                    }, this)}
                </div>);
            }, this)}
        </div>);
    }
}

CrosswordBoard.propTypes = {
    board: React.PropTypes.instanceOf(Board).isRequired,
    onClick: React.PropTypes.func.isRequired,
};

module.exports = CrosswordBoard;