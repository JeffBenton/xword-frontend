import React from 'react';
import CrosswordController from './../Crossword/CrosswordController.js';
import AppLoading from './AppLoading.js';
import AppHeader from './AppHeader.js';
import AppError from './AppError.js';
import {canUseLocalStorage, getSolveState, hasSolveState} from './../../util/localstoragehelper.js';
import history from './../../history.js';
import PuzzleApiHelper from './../../api/PuzzleApiHelper.js';

/**
 * High-level React component that defines the solve portion of the crossword App.
 *
 * Supports loading a puzzle from the database or from localstorage.
 */
class AppSolve extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeState(props.params);
    }

    /**
     * Initialize the component state.
     *
     * We could get path params passed into this element from the Router. If we have an id,
     * we'll try to load that puzzle. If we don't have an id, we'll load the puzzle from localstorage.
     *
     * @param params
     * @returns {*} the initial state for this component
     */
    initializeState(params) {
        var state;
        if (canUseLocalStorage() && hasSolveState()) {
            state = getSolveState();
        }

        // we were passed an id. use that to load the puzzle.
        if (params != null && params.id != null) {

            // if the puzzle in localstorage is that puzzle, load it!
            if (state && state.params && params.id === state.params.id) {
                return {
                    isLoading: false,
                    game: state.game,
                    params: state.params
                };
            }

            // if not, go to the database for the puzzle
            this.loadSolveGame(params.id);
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

            // if the puzzle from localstorage has an id (it should), we should update the url
            if (state.params && state.params.id) {
                result.replace = "/solve/" + state.params.id;
            }

            return result;
        }

        // we didn't have params or a saved puzzle... why are we here...?
        console.error("invalid params passed to appsolve");
        this.setState({
            error: "Couldn't find a puzzle to solve!"
        });
    }

    /**
     * We might want to redirect or change the URL. Do it when the component mounts.
     */
    componentDidMount() {
        if (this.state.replace) {
            history.replaceState(null, this.state.replace);
            this.setState({replace: null});
        }
    }

    /**
     * Get a puzzle from the database with the specified id.
     *
     * If we succeed, the state will be updated with the puzzle we got. If we fail, 'error' will be
     * set in this component's state.
     *
     * @param id
     */
    async loadSolveGame(id) {
        await PuzzleApiHelper.getById(id,
            (data) => {
                // set the state
                this.setState({
                    game: data.game,
                    isLoading: false,
                    params: {
                        id: data.id,
                        metadata: data.metadata
                    }
                });
            },
            (error) => {
                console.error(error);
                this.setState({
                    error: "Couldn't find the specified puzzle to solve."
                });
            }
        );
    }

    /**
     * Create a helper object to give child react elements the ability to get answers to crossword puzzles.
     *
     * Example usage:
     *      solver.verify().box(box, {success callback}, {failure callback});
     *      solver.answer().puzzle({success callback}, {failure callback});
     *
     * Look at the verify/answer functions in PuzzleApiHelper for more details.
     *
     * @returns {*}
     */
    createSolver() {
        if (!this.state.params || !this.state.params.id) {
            return null;
        }
        let id = this.state.params.id;

        return {
            // create verify functions
            verify: () => {
                return {
                    box: (box, success, failure) => {
                        PuzzleApiHelper.verifyBox(id, box, success, failure);
                    },
                    clue: (clue, success, failure) => {
                        PuzzleApiHelper.verifyClue(id, clue, success, failure);
                    },
                    puzzle: (board, success, failure) => {
                        PuzzleApiHelper.verifyBoard(id, board, success, failure);
                    }
                }
            },
            // create answer functions
            answer: () => {
                return {
                    box: (box, success, failure) => {
                        PuzzleApiHelper.answerBox(id, box, success, failure);
                    },
                    clue: (clue, success, failure) => {
                        PuzzleApiHelper.answerClue(id, clue, success, failure);
                    },
                    puzzle: (success, failure) => {
                        PuzzleApiHelper.answerBoard(id, success, failure);
                    }
                }
            }
        }
    }

    /**
     * Render the AppSolve element.
     *
     * @returns {XML}
     */
    render() {
        if (this.state.error) {
            // if we have an error, render it
            return (<div><AppHeader /><AppError error={this.state.error}/></div>)
        } else if (this.state.isLoading || this.state.replace){
            // show a loading page if we're loading or thinking
            return (<div><AppHeader /><AppLoading /></div>);
        } else {
            // show the solve crossword game!
            return (
                <div>
                    <AppHeader />
                    <div className="app-body">
                        <CrosswordController
                            game={this.state.game}
                            params={this.state.params}
                            solver={this.createSolver()}
                        />
                    </div>
                </div>);
        }
    }
}

module.exports = AppSolve;
