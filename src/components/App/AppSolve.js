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
import AppError from './AppError.js';
import {canUseLocalStorage, getSolveState} from './../../util/localstoragehelper.js';
import {API_URL} from './../../util/constants.js';
import history from './../../history.js';

class AppSolve extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeState(props.params);
    }

    initializeState(params) {
        var state;
        if (canUseLocalStorage()) {
            state = getSolveState();
        }
        if (params != null && params.id != null) {
            if (params.id === state.params.id) {
                return {
                    isLoading: false,
                    game: state.game,
                    params: state.params
                };
            }
            this.loadSolveGame(params.id);
            return {
                isLoading: true,
                game: null,
                params: null
            };
        } else if (state) {
            if (state.params && state.params.id) {
                return {
                    isLoading: false,
                    game: state.game,
                    params: state.params,
                    replace: "/solve/" + state.params.id
                };
            }
            return {

            };
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

    componentDidMount() {
        if (this.state.replace) {
            history.replaceState(null, this.state.replace);
            this.setState({replace: null});
        }
    }

    async loadSolveGame(id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = API_URL + 'puzzle/v2/' + id;

        let ajax = {
            method: 'GET',
            headers: headers
        };

        try {
            let response = await fetch(url, ajax);
            let data = await response.json();

            this.setState({
                game: Game.fromSavedPuzzle(data.board, data.clues),
                isLoading: false,
                params: {
                    id: data.id,
                    metadata: Metadata.fromSavedMetadata(data.metadata)
                }
            });
        } catch (e) {
            console.error('error when loading game.');
            this.setState({
                error: "Couldn't find the specified puzzle to solve."
            });
        }
    }

    render() {
        if (this.state.error) {
            return (<div><AppHeader /><AppError error={this.state.error}/></div>)
        } else if (this.state.isLoading || this.state.replace){
            return (<div><AppHeader /><AppLoading /></div>);
        } else {
            return (<div><AppHeader />
                <div className="app-body"><CrosswordController game={this.state.game} params={this.state.params}/></div>
            </div>);
        }
    }
}

module.exports = AppSolve;
