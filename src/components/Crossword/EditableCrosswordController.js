/**
 * Created by alex on 12/13/15.
 */

import React from 'react';
import EditableCrossword from './EditableCrossword.js';
import {API_URL} from './../../objects/constants.js';

class EditableCrosswordController extends React.Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
    }

    save() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = API_URL + 'puzzle/';
        var ajax = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(this.props.game.getSaveState())
        };
        fetch(url, ajax).then(function(response) { console.log(response) });
    }

    render() {
        return (<EditableCrossword game={this.props.game} onSave={this.save} />);
    }
}

module.exports = EditableCrosswordController;