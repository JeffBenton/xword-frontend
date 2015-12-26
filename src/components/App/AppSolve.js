/**
 *
 * @author alex
 */

import React from 'react';
import CrosswordController from './../Crossword/CrosswordController.js';
import Game from './../../objects/game.js';
import AppLoading from './AppLoading.js';
import AppHeader from './AppHeader.js';
import {API_URL} from './../../objects/constants.js';

class AppSolve extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeState(props.params);
    }

    initializeState(params) {
        if (params != null && params.id != null) {
            this.loadSolveGame(params.id);
            return {
                isLoading: true,
                game: null,
                params: null
            };
        } else {
            return {
                isLoading: false,
                game: new Game(this.props.width, this.props.height),
                params: null
            };
        }
    }

    // todo: error handling
    async loadSolveGame(id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = API_URL + 'puzzle/' + id;

        let ajax = {
            method: 'GET',
            headers: headers
        };

        let response = await fetch(url, ajax);
        let data = await response.json();

        this.setState({
            game: Game.fromSavedPuzzle(data.board, data.clues),
            isLoading: false,
            params: {id: data.id}
        });
    }

    render() {
        if (this.state.isLoading){
            return (<div><AppLoading /></div>);
        } else {
            return (<div><AppHeader /><CrosswordController game={this.state.game} params={this.state.params}/></div>);
        }
    }
}

module.exports = AppSolve;
