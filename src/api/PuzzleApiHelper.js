import {API_URL} from './../util/constants.js';
import Game from './../objects/game.js';
import Metadata from './../objects/metadata.js';

/**
 * Contains static functions to help with making requests to the Puzzle API backend.
 *
 * Supports saving puzzles, getting puzzles, and checking answers.
 */
class PuzzleApiHelper {

    /**
     * Get a puzzle from the database with the specified id.
     **
     * @param id the id of the puzzle to get
     * @param success the function to call when this api call is successful.
     *                will be passed in the following object:
     *                {{
     *                      id: the puzzle id
     *                      game: the game state
     *                      metadata: a metadata object
     *                }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static async getById(id, success, failure) {
        var url = API_URL + 'puzzle/v2/' + id;
        this._get(url, null, (data) => {
            success({
                id: data.id,
                game: Game.fromSavedPuzzle(data.board, data.clues),
                metadata: Metadata.fromSavedMetadata(data.metadata)
            });
        }, (error) => {
            failure("error when loading game: couldn't find a puzzle with id: " + id);
        });
    }

    /**
     * Get a puzzle from the database with the specified editId.
     *
     * @param editId the editId of the puzzle to get
     * @param success the function to call when this api call is successful.
     *                will be passed in the following object:
     *                {{
     *                      id: the puzzle id
     *                      editId: the puzzle editId
     *                      game: the game state
     *                      metadata: a metadata object
     *                }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static async getByEditId(editId, success, failure) {
        var url = API_URL + 'puzzle/v2/edit/' + editId;
        this._get(url, null, (data) => {
            success({
                id: data.id,
                editId: data.editId,
                game: Game.fromSavedPuzzle(data.board, data.clues),
                metadata: Metadata.fromSavedMetadata(data.metadata)
            });
        }, (error) => {
            failure("error when loading game: couldn't find a puzzle with id: " + id);
        });
    }

    /**
     * Call the API to save a puzzle.
     *
     * @param puzzle    an object representing the puzzle state, with shape:
     *                  {{
     *                      board: 2d array of {value, attribute} box pairs
     *                      clues: array containing all the clue objects in the puzzle
     *                      metadata: a metadata object for this puzzle
     *                  }}
     * @param success the function to call when this api call is successful.
     *                will be passed in the following object:
     *                {{
     *                      id: the puzzle id of the newly saved puzzle
     *                      editId: the editId of the newly saved puzzle
     *                }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static async save(puzzle, success, failure) {
        var url = API_URL + 'puzzle/v2/';
        this._post(url, puzzle, success, failure);
    }

    /**
     * Call the API to update an existing puzzle.
     *
     * @param puzzle    an object representing the puzzle state, with shape:
     *                  {{
     *                      editId: the editId of this existing puzzle
     *                      board: 2d array of {value, attribute} box pairs
     *                      clues: array containing all the clue objects in the puzzle
     *                      metadata: a metadata object for this puzzle
     *                  }}
     * @param success the function to call when this api call is successful.
     *                will be passed in the following object:
     *                {{
     *                      id: the puzzle id of the newly saved puzzle
     *                      editId: the editId of the newly saved puzzle
     *                }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static async update(puzzle, success, failure) {
        var url = API_URL + 'puzzle/v2/';
        this._put(url, puzzle, success, failure);
    }

    /**
     * Verify that the value contained in a box is correct.
     *
     * @param id    the id of the puzzle to check against
     * @param box   an object with shape:
     *              {{
     *                  x: the x position of the box
     *                  y: the y position of the box
     *                  value: the value of the box
     *              }}
     * @param success   the function to call when this api call is successful.
     *                  will be passed an object with shape:
     *                  {{
     *                      answer: boolean (true if the box value is correct, false otherwise)
     *                  }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static verifyBox(id, box, success, failure) {
        let url = API_URL + 'puzzle/' + id + '/char/verify';
        let body = {
            x: box.x,
            y: box.y,
            character: box.value
        };
        this._post(url, body, success, failure);
    }

    /**
     * Verify that the answer to a clue is correct.
     *
     * @param id    the id of the puzzle to check against
     * @param clue  an object with shape:
     *              {{
     *                  number: the number of the clue
     *                  direction: the direction of the clue (across or down)
     *                  answer: an array containing the clue answer, where each array element represents a box value
     *              }}
     * @param success   the function to call when this api call is successful.
     *                  will be passed an object with shape:
     *                  {{
     *                      answer: a list of boolean, where each array element represents true if the box value for
     *                      that index is correct, false otherwise
     *                  }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static verifyClue(id, clue, success, failure) {
        let url = API_URL + 'puzzle/' + id + '/clue/verify';
        let body = {
            number: clue.number,
            direction: clue.direction.toUpperCase(),
            answer: clue.answer
        };

        this._post(url, body, success, failure);
    }

    /**
     * Verify the answer to a game board.
     *
     * @param id    the id of the puzzle to check against
     * @param board  an object with shape:
     *              {{
     *                  answer: a 2d array of string, where each array element is a box value
     *              }}
     * @param success   the function to call when this api call is successful.
     *                  will be passed an object with shape:
     *                  {{
     *                      answer: a 2d array of boolean, where each array element represents true if the box value for
     *                      that index is correct, false otherwise
     *                  }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static verifyBoard(id, board, success, failure) {
        let url = API_URL + 'puzzle/v2/' + id + '/board/verify';
        let body = {
            answer: board.values()
        };

        this._post(url, body, success, failure);
    }

    /**
     * Get the value for a specific box in a puzzle.
     *
     * @param id    the id of the puzzle to check against
     * @param box   an object with shape:
     *              {{
     *                  x: the x position of the box
     *                  y: the y position of the box
     *              }}
     * @param success   the function to call when this api call is successful.
     *                  will be passed an object with shape:
     *                  {{
     *                      answer: string (the value of the box)
     *                  }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static answerBox(id, box, success, failure) {
        let url = API_URL + 'puzzle/' + id + '/char/answer';
        let body = {
            x: box.x,
            y: box.y
        };

        this._get(url, body, success, failure);
    }

    /**
     * Get the answer to a specific box in a puzzle.
     *
     * @param id    the id of the puzzle to check against
     * @param clue  an object with shape:
     *              {{
     *                  number: the number of the clue
     *                  direction: the direction of the clue (across or down)
     *              }}
     * @param success   the function to call when this api call is successful.
     *                  will be passed an object with shape:
     *                  {{
     *                      answer: an array of string, where each array element contains the value of a box in
     *                      the clue
     *                  }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static answerClue(id, clue, success, failure) {
        let url = API_URL + 'puzzle/' + id + '/clue/answer';
        let body = {
            number: clue.number,
            direction: clue.direction.toUpperCase()
        };

        this._get(url, body, success, failure);
    }

    /**
     * Get the answer to a game board.
     *
     * @param id    the id of the puzzle to get the answer
     * @param success   the function to call when this api call is successful.
     *                  will be passed an object with shape:
     *                  {{
     *                      answer: a 2d array of boolean, where each array element contains a box value
     *                  }}
     * @param failure the function to call when this api call fails. will be passed a string error message.
     */
    static answerBoard(id, success, failure) {
        let url = API_URL + 'puzzle/' + id + '/board/answer';
        this._get(url, null, success, failure);
    }

    /**
     * Helper function to make POST ajax requests.
     *
     * @param url the url
     * @param body the request body
     * @param success a success callback function
     * @param failure a failure callback function
     * @private
     */
    static _post(url, body, success, failure) {
        let ajax = {
            method: 'POST',
            body: JSON.stringify(body)
        };

        this._request(url, ajax, success, failure);
    }

    /**
     * Helper function to make PUT ajax requests.
     *
     * @param url the url
     * @param body the request body
     * @param success a success callback function
     * @param failure a failure callback function
     * @private
     */
    static _put(url, body, success, failure) {
        let ajax = {
            method: 'PUT',
            body: JSON.stringify(body)
        };

        this._request(url, ajax, success, failure);
    }

    /**
     * Helper function to make GET ajax requests.
     *
     * @param url the url
     * @param body a 'body' object that will be converted into url params
     * @param success a success callback function
     * @param failure a failure callback function
     * @private
     */
    static _get(url, body, success, failure) {
        let ajax = {
            method: 'GET'
        };
        let path = url;
        if (body) {
            let params = Object.keys(body).map((key) => {
                return key + "=" + body[key];
            });
            path += '?' + params.join('&');
        }

        this._request(path, ajax, success, failure);
    }

    /**
     * Shared code for all ajax requests.
     *
     * @param url the url
     * @param ajax the completed ajax request object
     * @param success a success callback function
     * @param failure a failure callback function
     * @private
     */
    static _request(url, ajax, success, failure) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        ajax.headers = headers;
        (async () => {
            try {
                let response = await fetch(url, ajax);
                let data = await response.json();

                if (data.error) {
                    if (failure) {
                        failure(data.error);
                    }
                } else if (success) {
                    success(data);
                }
            } catch (e) {
                if (failure) {
                    failure(e);
                }
            }
        })();
    }

}

module.exports = PuzzleApiHelper;