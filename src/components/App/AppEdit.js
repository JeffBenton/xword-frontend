/**
 *
 * @author alex
 */

import React from 'react';
import EditableCrosswordController from './../Crossword/EditableCrosswordController.js';
import Game from './../../objects/game.js';
import Metadata from './../../objects/metadata.js';
import AppLoading from './AppLoading.js';
import AppHeader from './AppHeader.js';
import {API_URL} from './../../util/constants.js';
import {canUseLocalStorage, getEditState} from './../../util/localstoragehelper.js';
import history from './../../history.js';

class AppEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeState(props.params);
    }

    initializeState(params) {
        var state;
        if (canUseLocalStorage()) {
             state = getEditState();
        }
        if (params != null && params.id != null) {
            if (state.params && state.params.editId === params.id) {
                return {
                    isLoading: false,
                    isCreating: false,
                    game: state.game,
                    params: state.params
                };
            }
            this.loadEditGame(params.id);
            return {
                isLoading: true,
                isCreating: false,
                game: null,
                params: null
            };
        } else if (state) {
            if (state.params && state.params.editId) {
                history.replaceState(null, "/edit/" + state.params.editId);
            }
            return {
                isLoading: false,
                isCreating: false,
                game: state.game,
                params: state.params
            }
        }
        console.error("invalid params passed to appedit");
        return {
            redirect: "/create"
        };
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
            isLoading: false,
            params: {
                id: data.id,
                editId: data.editId,
                metadata: Metadata.fromSavedMetadata(data.metadata)
            }
        });
    }
    componentDidMount() {
        if (this.state.redirect) {
            history.pushState(null, this.state.redirect);
        }
    }

    render() {
        if (this.state.redirect || this.state.isLoading){
            return (<div><AppLoading /></div>);
        } else if (this.state.isChoosing) {
            return (<div><AppChoosing header="Use local version?" body=""/></div>)
        } else {
            return (
                <div>
                    <AppHeader />
                    <div className="app-body"><EditableCrosswordController
                        game={this.state.game}
                        params={this.state.params}
                        canUseLocalStorage={canUseLocalStorage()}
                        reload={() => {
                                this.setState({isLoading: true});
                                this.loadEditGame(this.state.params.editId);
                        }}
                    /></div>
                </div>);
        }
    }
}

module.exports = AppEdit;