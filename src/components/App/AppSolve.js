/**
 *
 * @author alex
 */

import React from 'react';
import CrosswordController from './../Crossword/CrosswordController.js';
import Game from './../../objects/game.js';
import Metadata from './../../objects/metadata.js';
import AppLoading from './AppLoading.js';
import AppHeader from './AppHeader.js';
import {canUseLocalStorage, getSolveState} from './../../util/localstoragehelper.js';
import {API_URL} from './../../util/constants.js';

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
        } else if (canUseLocalStorage()) {
            let state = getSolveState();
            if (state) {
                return {
                    isLoading: false,
                    game: state.game,
                    params: state.params
                }
            }
        } else {
            return {
                isLoading: false,
                game: new Game(this.props.width, this.props.height),
                params: {
                    metadata: new Metadata()
                }
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
            params: {id: data.id,
                metadata: Metadata.fromSavedMetadata(data.metadata)
            }
        });
    }

    render() {
        if (this.state.isLoading){
            return (<div><AppLoading /></div>);
        } else {
            return (<div><AppHeader />
                <div className="app-body"><CrosswordController game={this.state.game} params={this.state.params}/></div>
            </div>);
        }
    }
}

module.exports = AppSolve;
