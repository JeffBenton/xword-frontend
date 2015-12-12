import React from 'react';
import Crossword from './../Crossword/Crossword.js';
import EditableCrossword from './../Crossword/EditableCrossword.js';
import Game from './../../objects/game.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: new Game(props.width, props.height)
        };
    }

    render() {
        if (this.props.mode === 'CREATE') {
            return (<div><EditableCrossword game={this.state.game} /></div>);
        } else {
            return (<div><Crossword game={this.state.game} /></div>);
        }
    }

}

App.propTypes = {
    mode: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number
};
App.defaultProps = {
    mode: "CREATE",
    width: 15,
    height: 15
};


module.exports = App;