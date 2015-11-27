/**
 * Created by alex on 11/27/15.
 */

let React = require('react');
let CrosswordBox = require('./../Crossword/CrosswordBox.js');

class CrosswordBoard extends React.Component {

    render() {
        var crosswordStyle = {
            height: this.props.boxSize*this.props.board.length + 'px',
            width: this.props.boxSize*this.props.board[0].length + 'px',
            border: '1px black solid'
        };
        var crosswordRowStyle = {
            height: this.props.boxSize + 'px',
            width: '100%',
            display: 'flex'
        };

        return (<div className='crossword' style={crosswordStyle}>
            {this.props.board.map(function (row, index) {
                return (<div className='crossword-row' style={crosswordRowStyle} key={index}>
                    {row.map(function (box) {
                        return (<CrosswordBox onClick={this.props.onClick} box={box} key={box.id} />);
                    }, this)}
                </div>);
            }, this)}
        </div>);
    }
}

CrosswordBoard.propTypes = {
    board: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.object)).isRequired,
    onClick: React.PropTypes.func.isRequired,
    boxSize: React.PropTypes.number
};

CrosswordBoard.defaultProps = {
    boxSize: 30
};

module.exports = CrosswordBoard;