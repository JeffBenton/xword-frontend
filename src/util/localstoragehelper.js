/**
 *
 * @author alex
 */

import Game from './../objects/game.js';
import Metadata from './../objects/metadata.js';

class LocalStorageHelper {

    /**
     * Detects whether localStorage is supported and available.
     *
     * (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
     *
     * @returns boolean - true if localStorage is supported and available, false otherwise.
     */
    static canUseLocalStorage() {
        try {
            var storage = window.localStorage,
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return false;
        }
    }

    static setEditState(state) {
        window.localStorage.setItem("edit", JSON.stringify({
            game: state.game.getSaveState(),
            params: state.params
        }));
    }

    static hasEditState() {
        return !!window.localStorage.getItem("edit");
    }

    static getEditState() {
        let state = JSON.parse(window.localStorage.getItem("edit"));
        let game = Game.fromSavedPuzzle(state.game.board, state.game.clues);
        let params = state.params;
        if (state.params.metadata) {
            params.metadata = Metadata.fromSavedMetadata(state.params.metadata);
        }
        return {game: game, params: params}
    }

    static setSolveState(state) {
        window.localStorage.setItem("solve", JSON.stringify({
            game: state.game.getSaveState(),
            params: state.params
        }));
    }

    static hasSolveState() {
        return !!window.localStorage.getItem("solve");
    }

    static getSolveState() {
        let state = JSON.parse(window.localStorage.getItem("solve"));
        let game = Game.fromSavedPuzzle(state.game.board, state.game.clues);
        let params = state.params;
        if (state.params.metadata) {
            params.metadata = Metadata.fromSavedMetadata(state.params.metadata);
        }
        return {game: game, params: params};
    }
}

module.exports = LocalStorageHelper;