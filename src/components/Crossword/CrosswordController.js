/**
 * Created by alex on 12/13/15.
 */
import React from 'react';
import Crossword from './Crossword.js';
import {API_URL} from './../../util/constants.js';

class CrosswordController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.params ? props.params.id : null
        }
    }

    solveHelper() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return {
            verify: () => {
                let makeAjaxCall = (url, body, success, failure) => {
                    let ajax = {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(body)
                    };
                    (async () => {
                        try {
                            let response = await fetch(url, ajax);
                            let data = await response.json();

                            if (data.error) {
                                throw data;
                            }

                            if (success) {
                                success(data);
                            }
                        } catch (e) {
                            if (failure) {
                                failure(e);
                            }
                        }
                    })();
                };

                return {
                    box: (box, success, failure) => {
                        let url = API_URL + 'puzzle/' + this.state.id + '/char/verify';
                        let body = {
                            x: box.x,
                            y: box.y,
                            character: box.value
                        };
                        makeAjaxCall(url, body, success, failure);
                    },
                    clue: (clue, success, failure) => {
                        let url = API_URL + 'puzzle/' + this.state.id + '/clue/verify';
                        let body = {
                            number: clue.number,
                            direction: clue.direction.toUpperCase(),
                            answer: clue.answer
                        };
                        makeAjaxCall(url, body, success, failure);
                    },
                    puzzle: (board, success, failure) => {
                        let url = API_URL + 'puzzle/' + this.state.id + '/board/verify';
                        let body = {
                            answer: board.values()
                        };
                        makeAjaxCall(url, body, success, failure);
                    }

                }
            },
            answer: () => {
                let makeAjaxCall = (url, body, success, failure) => {
                    let ajax = {
                        method: 'GET',
                        headers: headers,
                    };
                    let path = url;
                    if (body) {
                        let params = [];
                        for (let key in body) {
                            if (body.hasOwnProperty(key)) {
                                params.push(key + "=" + body[key]);
                            }
                        }
                        path += '?' + params.join('&');
                    }

                    (async () => {
                        try {
                            let response = await fetch(path, ajax);
                            let data = await response.json();

                            if (data.error) {
                                throw data;
                            }

                            if (success) {
                                success(data);
                            }
                        } catch (e) {
                            if (failure) {
                                failure(e);
                            }
                        }
                    })();
                };

                return {
                    box: (box, success, failure) => {
                        let url = API_URL + 'puzzle/' + this.state.id + '/char/answer';
                        let body = {
                            x: box.x,
                            y: box.y
                        };
                        makeAjaxCall(url, body, success, failure);
                    },
                    clue: (clue, success, failure) => {
                        let url = API_URL + 'puzzle/' + this.state.id + '/clue/answer';
                        let body = {
                            number: clue.number,
                            direction: clue.direction.toUpperCase()
                        };
                        makeAjaxCall(url, body, success, failure);
                    },
                    puzzle: (board, success, failure) => {
                        let url = API_URL + 'puzzle/' + this.state.id + '/board/answer';
                        makeAjaxCall(url, null, success, failure);
                    }
                }
            }
        }
    }

    render() {
        return (<Crossword game={this.props.game} metadata={this.props.params ? this.props.params.metadata : null} solver={this.solveHelper()}/>);
    }
}

module.exports = CrosswordController;
