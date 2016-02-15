import Game from './../objects/game.js';
import Metadata from './../objects/metadata.js';

/**
 * Contains helpful functions for storing and retrieving data from LocalStorage.
 */
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

    /**
     * Set the last-edited puzzle in LocalStorage.
     *
     * @param state the save state of the edit puzzle
     */
    static setEditState(state) {
        window.localStorage.setItem("edit", JSON.stringify({
            game: state.game.getSaveState(),
            params: state.params
        }));
    }

    /**
     * Is there a last-edited puzzle currently saved in LocalStorage?
     *
     * @returns {boolean} true if there's a edit puzzle in LocalStorage, false otherwise
     */
    static hasEditState() {
        return !!window.localStorage.getItem("edit");
    }

    /**
     * Get the last-edited puzzle from LocalStorage.
     *
     * @returns {*} the saved puzzle state, or null if it can't be found
     */
    static getEditState() {
        let state = JSON.parse(window.localStorage.getItem("edit"));

        if (!state) {
            return null;
        }

        // recreate our game objects
        let game = Game.fromSavedPuzzle(state.game.board, state.game.clues);
        let params = state.params;
        if (state.params.metadata) {
            params.metadata = Metadata.fromSavedMetadata(state.params.metadata);
        }

        return {game: game, params: params}
    }

    /**
     * Set the last-solved puzzle in LocalStorage.
     *
     * @param state the save state of the solve puzzle
     */
    static setSolveState(state) {
        window.localStorage.setItem("solve", JSON.stringify({
            game: state.game.getSaveState(),
            params: state.params
        }));
    }

    /**
     * Is there a last-solved puzzle currently saved in LocalStorage?
     *
     * @returns {boolean} true if there's a solve puzzle in LocalStorage, false otherwise
     */
    static hasSolveState() {
        return !!window.localStorage.getItem("solve");
    }

    /**
     * Get the last-solved puzzle from LocalStorage.
     *
     * @returns {*} the saved puzzle state, or null if it can't be found
     */
    static getSolveState() {
        let state = JSON.parse(window.localStorage.getItem("solve"));

        if (!state) {
            return null;
        }

        // recreate our game objects
        let game = Game.fromSavedPuzzle(state.game.board, state.game.clues);
        let params = state.params;
        if (state.params.metadata) {
            params.metadata = Metadata.fromSavedMetadata(state.params.metadata);
        }

        return {game: game, params: params};
    }
}

module.exports = LocalStorageHelper;