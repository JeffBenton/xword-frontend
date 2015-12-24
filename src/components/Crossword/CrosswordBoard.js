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
            boxSize: 30
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.setState({
           boxSize: ReactDOM.findDOMNode(this).offsetWidth / this.props.board.height
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.setState({
            boxSize: ReactDOM.findDOMNode(this).offsetWidth / this.props.board.height
        });
    }

    render() {
        var crosswordStyle = {
            height: this.state.boxSize*this.props.board.height + 'px',
            //width: this.props.boxSize*this.props.board.width + 'px',
            width: '100%',
            border: '1px black solid',
            marginLeft: "auto",
            marginRight: "auto"
        };
        var crosswordRowStyle = {
            height: this.state.boxSize + 'px',
            width: '100%',
            display: 'flex'
        };

        return (<div className='crossword' style={crosswordStyle}>
            {this.props.board.board.map(function (row, index) {
                return (<div className='crossword-row' style={crosswordRowStyle} key={index}>
                    {row.map(function (box) {
                        return (<CrosswordBox onClick={this.props.onClick} box={box} key={box.id} size={this.state.boxSize}/>);
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