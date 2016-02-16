import React from 'react';
import EditableCrosswordController from './../Crossword/EditableCrosswordController.js';
import Game from './../../objects/game.js';
import Metadata from './../../objects/metadata.js';
import AppCreating from './AppCreating.js';
import AppHeader from './AppHeader.js';
import {API_URL} from './../../util/constants.js';
import {canUseLocalStorage} from './../../util/localstoragehelper.js';

/**
 * High-level React component that defines the create portion of the crossword App.
 *
 * Contains a menu that allows the user to select the height and width of the puzzle they're creating, then
 * creates a new puzzle for the user to edit.
 */
class AppCreate extends React.Component {

    constructor(props) {
        super(props);

        // initialize the state
        this.state = {
            isCreating: true,
            game: null,
            params: null
        };
        this.startCreate = this.startCreate.bind(this);
    }

    /**
     * Callback from the AppCreating form. Use the width and height from the params to create
     * the puzzle.
     *
     * @param params object with width and height defined
     */
    startCreate(params) {
        let width = params.width;
        let height = params.height;
        this.setState({
            isCreating: false,
            game: new Game(width, height),
            params: {
                metadata: new Metadata()
            }
        });
    }

    render() {
        if (this.state.isCreating) {
            // if we're 'creating,' show the AppCreating form
            return (<div>
                <AppHeader />
                <AppCreating onSubmit={this.startCreate}/></div>)
        } else {
            // we're done creating, render the game
            return (
                <div>
                    <AppHeader />
                    <div className="app-body">
                        <EditableCrosswordController
                            game={this.state.game}
                            type="create"
                            params={this.state.params}
                            canUseLocalStorage={canUseLocalStorage()}
                        /></div>
                </div>);
        }
    }
}

module.exports = AppCreate;