/**
 * Created by alex on 12/13/15.
 */

import React from 'react';
import EditableCrossword from './EditableCrossword.js';
import Metadata from './../../objects/metadata.js';
import {API_URL} from './../../util/constants.js';
import {setEditState} from './../../util/localstoragehelper.js';

class EditableCrosswordController extends React.Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.handleMetadataUpdate = this.handleMetadataUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            editId: props.params ? props.params.editId : null,
            id: props.params ? props.params.id : null,
            metadata: props.params ? props.params.metadata : new Metadata()
        };
    }

    save(cb) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var url = API_URL + 'puzzle/';

        var body = this.props.game.getSaveState();
        body.metadata = this.state.metadata;

        if (this.state.editId == null) {
            let ajax = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
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
                if (cb) {
                    cb();
                }
            })();
        } else {
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
                if (cb) {
                    cb();
                }
            })();
        }
    }

    handleMetadataUpdate(event) {
        let metadata = this.state.metadata;
        for (let key in event) {
            if (event.hasOwnProperty(key) && metadata.hasOwnProperty(key)) {
                metadata[key] = event[key];
            }
        }
        this.setState({metadata: metadata});
    }

    handleChange(event) {
        let params = {
            editId: this.state.editId,
            id: this.state.id,
            metadata: this.state.metadata
        };
        setEditState({
            game: this.props.game,
            params: params
        });
    }

    render() {
        return (<EditableCrossword game={this.props.game}
                                   metadata={this.state.metadata}
                                   onMetadataUpdate={this.handleMetadataUpdate}
                                   onSave={this.save}
                                   onChange={this.handleChange}
                                   id={this.state.id}
                                   editId={this.state.editId}
                                   reload={this.props.reload}
        />);
    }
}

EditableCrosswordController.propTypes = {
    params: React.PropTypes.shape({
        editId: React.PropTypes.string,
        id: React.PropTypes.string,
        metadata: React.PropTypes.instanceOf(Metadata)
    })
};
module.exports = EditableCrosswordController;