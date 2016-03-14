import React from 'react';
import ReactDOM from 'react-dom';
import CrosswordBox from './CrosswordBox.js';
import Board from './../../objects/board.js';
import './CrosswordBoard.css';

/**
 * The crossword board. Handles rendering the grid of CrosswordBoxes.
 *
 * props:
 *      board - Board - a Board object
 *      onClick - function - function to call if a box gets clicked
 */
class CrosswordBoard extends React.Component {

    constructor(props) {
        super(props);

        // this isn't super relevant because the height/width will be overridden on resize.
        // but we need some default value
        this.state = {
            height: this.props.defaultBoxSize.height * this.props.board.height,
            width: this.props.defaultBoxSize.width * this.props.board.width
        };
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * When this component mounts, set the size of the crossword board based on the size of the DOM node.
     *
     * Listen for window resizing because we'll have to readjust the board.
     */
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.setState({
           height: ReactDOM.findDOMNode(this).offsetWidth / this.props.board.width * this.props.board.height,
            width: ReactDOM.findDOMNode(this).offsetWidth
        });
    }

    /**
     * Remove the event listener on unmount.
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    /**
     * Resize the game board when the window is resized.
     */
    handleResize() {
        this.setState({
            height: ReactDOM.findDOMNode(this).offsetWidth / this.props.board.width * this.props.board.height,
            width: ReactDOM.findDOMNode(this).offsetWidth
        });
    }

    /**
     * Render the crossword board.
     *
     * @returns {XML}
     */
    render() {

        // set the box height and width from the total size of the board
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
                {// create a CrosswordBox for each board element
                    this.props.board.board.map(function (row, index) {
                    return (<div className='crossword-row' style={crosswordRowStyle} key={index}>
                        {row.map(function (box) {
                            return (<CrosswordBox
                                onClick={this.props.onClick}
                                box={box}
                                key={box.id}
                                height={boxHeight}
                                width={boxWidth}
                                maxY={this.props.board.height}
                                maxX={this.props.board.width}
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
    onClick: React.PropTypes.func.isRequired,
    defaultBoxSize: React.PropTypes.shape({
        width: React.PropTypes.number,
        height: React.PropTypes.number
    })
};

CrosswordBoard.defaultProps = {
    defaultBoxSize: {
        width: 30,
        height: 30
    }
};

module.exports = CrosswordBoard;