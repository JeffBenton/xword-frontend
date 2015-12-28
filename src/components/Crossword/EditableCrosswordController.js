/**
 * Created by alex on 12/13/15.
 */

import React from 'react';
import EditableCrossword from './EditableCrossword.js';
import {API_URL} from './../../util/constants.js';

class EditableCrosswordController extends React.Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.state = {
            editId: props.params ? props.params.editId : null,
            id: props.params ? props.params.id : null
        };
    }

    save() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = API_URL + 'puzzle/';

        if (this.state.editId == null) {
            let ajax = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(this.props.game.getSaveState())
            };
            (async () => {
                try {
                    let response = await fetch(url, ajax);
                    let data = await response.json();
                    this.setState({
                        id: data.id,
                        editId: data.editId
                    });
                    window.history.replaceState(data, "", "/edit/" + data.editId);
                } catch (e) {
                    console.error(e);
                }
            })();
        } else {
            var body = this.props.game.getSaveState();
            body.editId = this.state.editId;
            let ajax = {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(body)
            };
            (async () => {
                try {
                    let response = await fetch(url, ajax);
                    let data = await response.json();
                    // successfully updated
                    this.setState({
                        id: data.id,
                        editId: data.editId
                    });
                    window.history.replaceState(data, "", "/edit/" + data.editId);
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }

    render() {
        return (<EditableCrossword game={this.props.game} onSave={this.save} />);
    }
}

module.exports = EditableCrosswordController;