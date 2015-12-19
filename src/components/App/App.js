import React from 'react';

import AppOption from './AppOption.js';
import Crossword from './../Crossword/Crossword.js';
import EditableCrosswordController from './../Crossword/EditableCrosswordController.js';
import Game from './../../objects/game.js';
import {API_URL} from './../../objects/constants.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getStateFromParams(props.params);
    }

    getStateFromParams(params) {
        switch(params.action) {
            case 'edit':
                this.loadEditGame(params.id);
                return {mode: "LOADING"};
                break;
            default:
                return {mode: null};
        }
    }

    // todo: error handling
    async loadEditGame(id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = API_URL + 'puzzle/edit/' + id;

        let ajax = {
            method: 'GET',
            headers: headers
        };

        let response = await fetch(url, ajax);
        let data = await response.json();

        this.setState({
            game: Game.fromSavedPuzzle(data.board, data.clues),
            mode: 'CREATE',
            params: {id: data.id,
                        editId: data.editId}
        });
    }

    getAppOptions() {
        return [
            {
                title: "create",
                onClick: (function(context) {
                    return function() {
                        console.log("clicked create");
                        context.setState({
                            mode: 'CREATE',
                            game: new Game(context.props.width, context.props.height)
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
            return (<div><EditableCrosswordController game={this.state.game} params={this.state.params}/></div>);
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