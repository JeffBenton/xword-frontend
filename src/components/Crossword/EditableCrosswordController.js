/**
 * Created by alex on 12/13/15.
 */

import React from 'react';
import EditableCrossword from './EditableCrossword.js';
import Metadata from './../../objects/metadata.js';
import {setEditState} from './../../util/localstoragehelper.js';
import PuzzleApiHelper from './../../api/PuzzleApiHelper.js';

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
        var puzzle = this.props.game.getSaveState();
        puzzle.metadata = this.state.metadata;

        if (this.state.editId == null) {
            PuzzleApiHelper.save(puzzle,
                (data) => {
                    this.setState({
                        id: data.id,
                        editId: data.editId
                    });
                    window.history.replaceState(data, "", "/edit/" + data.editId);
                    if (cb) {
                        cb();
                    }
                },
                (error) => {
                    console.error(error);
                    if (cb) {
                        cb();
                    }
                }
            );
        } else {
            puzzle.editId = this.state.editId;
            PuzzleApiHelper.update(puzzle,
                (data) => {
                    // successfully updated
                    this.setState({
                        id: data.id,
                        editId: data.editId
                    });
                    window.history.replaceState(data, "", "/edit/" + data.editId);
                    if (cb) {
                        cb();
                    }
                },
                (error) => {
                    console.error(error);
                    if (cb) {
                        cb();
                    }
                }
            );
        }
    }

    handleMetadataUpdate(event) {
        let metadata = this.state.metadata;
        Object.keys(event).forEach((key) => {
            metadata[key] = event[key];
        });
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
                                   type={this.props.type}
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