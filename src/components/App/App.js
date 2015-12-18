import React from 'react';

import AppOption from './AppOption.js';
import Crossword from './../Crossword/Crossword.js';
import EditableCrosswordController from './../Crossword/EditableCrosswordController.js';
import Game from './../../objects/game.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: new Game(props.width, props.height),
            mode: null
        };
    }

    getAppOptions() {
        return [
            {
                title: "create",
                onClick: (function(context) {
                    return function() {
                        console.log("clicked create");
                        context.setState({
                            mode: 'CREATE'
                        });
                    }
                })(this)
            },
            {
                title: "edit",
                onClick: (function(context) {
                    return function() {
                        console.log("clicked edit");
                    }
                })(this)
            },
        ];
    }

    render() {
        if (this.state.mode === null) {
            return (<div>{this.getAppOptions().map(function (option, i) {
                return (<AppOption onClick={option.onClick} title={option.title} key={i}/>);
            })}</div>)
        } else if (this.state.mode === 'CREATE') {
            return (<div><EditableCrosswordController game={this.state.game} /></div>);
        } else if (this.state.mode === 'SOLVE') {
            return (<div><Crossword game={this.state.game} /></div>);
        } else if (this.state.mode === 'LOADING'){
            return (<div>loading...</div>);
        }
    }

}

App.propTypes = {
    mode: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number
};
App.defaultProps = {
    width: 15,
    height: 15
};


module.exports = App;