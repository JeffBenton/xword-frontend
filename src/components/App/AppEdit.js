import React from 'react';
import EditableCrosswordController from './../Crossword/EditableCrosswordController.js';
import AppLoading from './AppLoading.js';
import AppHeader from './AppHeader.js';
import AppError from './AppError.js';
import {canUseLocalStorage, hasEditState, getEditState} from './../../util/localstoragehelper.js';
import history from './../../history.js';
import PuzzleApiHelper from './../../api/PuzzleApiHelper.js';

/**
 * High-level React component that defines the edit portion of the crossword App.
 *
 * Supports loading a puzzle from the database or from localstorage.
 */
class AppEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeState(props.params);
    }

    /**
     * Initialize the state of this AppEdit element.
     *
     * We could get path params passed into this element from the Router. If we have an id,
     * we'll try to load that puzzle. If we don't have an id, we'll load the puzzle from localstorage.
     *
     * @param params
     * @returns {*} the initial state for this component
     */
    initializeState(params) {
        var state;
        if (canUseLocalStorage() && hasEditState()) {
            state = getEditState();
        }

        // we were passed an editId. use that to load the puzzle.
        if (params != null && params.id != null) {

            // if the puzzle in localstorage is that puzzle, load it!
            if (state && state.params && state.params.editId === params.id) {
                return {
                    isLoading: false,
                    game: state.game,
                    params: state.params
                };
            }

            // if not, go to the database for the puzzle
            this.loadEditGame(params.id);
            return {
                isLoading: true,
                game: null,
                params: null
            };

        } else if (state) {
            // we don't have params, but we have a puzzle in localstorage.
            // use that puzzle as the game state
            let result = {
                isLoading: false,
                game: state.game,
                params: state.params
            };

            // if the puzzle from localstorage has an editId, we should update the url
            if (state.params && state.params.editId) {
                result.replace = "/edit/" + state.params.editId;
            }
            return result;
        }

        // we didn't have params or a saved puzzle... why are we here...?
        console.error("invalid params passed to appedit");
        return {
            redirect: "/create"
        };
    }

    /**
     * Get a puzzle from the database with the specified editId.
     *
     * If we succeed, the state will be updated with the puzzle we got. If we fail, 'error' will be
     * set in this component's state.
     *
     * @param id
     */
    async loadEditGame(id) {
        await PuzzleApiHelper.getByEditId(id,
            (data) => {
                // set the state
                this.setState({
                    game: data.game,
                    isLoading: false,
                    params: {
                        id: data.id,
                        editId: data.editId,
                        metadata: data.metadata
                    }
                });
            },
            (error) => {
                console.error(error);
                this.setState({
                    error: "Couldn't find the specified puzzle to edit."
                });
            }
        );
    }

    /**
     * We might want to redirect or change the URL. Do it when the component mounts.
     */
    componentDidMount() {
        if (this.state.redirect) {
            history.pushState(null, this.state.redirect);
        }
        if (this.state.replace) {
            history.replaceState(null, this.state.replace);
            this.setState({replace: null});
        }
    }

    /**
     * Render the AppEdit element.
     *
     * @returns {XML}
     */
    render() {
        if (this.state.error) {
            // if we have an error, render it instead
            return (<div><AppHeader /><AppError error={this.state.error}/></div>)
        } else if (this.state.redirect || this.state.isLoading || this.state.replace){
            // show a loading page if we're loading or thinking
            return (<div>
                <AppHeader />
                    <div className="app-body"><AppLoading /></div>
                </div>);
        } else {
            // show the edit crossword game!
            return (
                <div>
                    <AppHeader />
                    <div className="app-body"><EditableCrosswordController
                        game={this.state.game}
                        params={this.state.params}
                        type="edit"
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