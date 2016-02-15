/**
 * Created by alex on 12/9/15.
 */

import React from 'react';
import Game from './../../objects/game.js';
import Metadata from './../../objects/metadata.js';
import Crossword from './Crossword.js';
import CrosswordBoard from './CrosswordBoard.js';
import CrosswordHeader from './CrosswordHeader.js';
import CrosswordSelectedClue from './CrosswordSelectedClue';
import EditableCrosswordClues from './EditableCrosswordClues.js';
import EditableCrosswordTitle from './EditableCrosswordTitle.js';
import EditableCrosswordMetadata from './EditableCrosswordMetadata.js';
import EditableCrosswordShareModal from './EditableCrosswordShareModal.js';
import EditableCrosswordReloadModal from './EditableCrosswordReloadModal.js';


class EditableCrossword extends Crossword {

    constructor(props) {
        super(props);
        this.state.clickAction = this.props.type === 'create' ? "CREATEBOX" : "SELECT";
        this.state.modal = null;
        this.handleClueUpdate = this.handleClueUpdate.bind(this);
        this.handleMetadataUpdate = this.handleMetadataUpdate.bind(this);
    }

    handleBoxClick(box) {
        switch (this.state.clickAction) {
            case 'CREATEBOX':
                this.props.game.toggleBoxStatus(box.x, box.y);
                this.setState(
                    {
                        board: this.props.game.board,
                        puzzle: this.props.game.puzzle,
                        clues: this.props.game.clues,
                        selectedBox: null,
                        selectedClue: {across: null, down: null, focused: null},
                        modal: null
                    }
                );
                if (this.props.onChange) {
                    console.log('board updated!!');
                    this.props.onChange();
                }
                break;
            case 'SELECT':
                // should select the clue we clicked on
                this.selectBox(box);
                break;
            case 'COLOR':
                if (box.isBlackBox()) {
                    this.props.game.toggleBoxStatus(box.x, box.y);
                } else {
                    this.props.game.clearSelectedClues();
                }
                if (box.attributes.color) {
                    delete box.attributes.color;
                } else {
                    box.attributes.color = 'DDDDDD';
                }

                this.setState(
                    {
                        selectedBox: null,
                        selectedClue: {across: null, down: null, focused: null}
                    }
                );

                if (this.props.onChange) {
                    console.log('board updated!!');
                    this.props.onChange();
                }
                break;
            case 'SHAPE':
                if (box.isBlackBox()) {
                    this.props.game.toggleBoxStatus(box.x, box.y);
                } else {
                    this.props.game.clearSelectedClues();
                }

                if (box.attributes.shape) {
                    delete box.attributes.shape;
                } else {
                    box.attributes.shape = 'circle';
                }

                this.setState(
                    {
                        selectedBox: null,
                        selectedClue: {across: null, down: null, focused: null}
                    }
                );

                if (this.props.onChange) {
                    console.log('board updated!!');
                    this.props.onChange();
                }
                break;
        }
    }

    getHeaderItems() {
        let saveGroup = [];
        if (this.props.editId && this.props.id) {
            saveGroup.push({
                name: "reload",
                onClick: () => {
                    this.setState({modal: "RELOAD"});
                },
                isClicked: false,
                icon: "cached"
            });
        }
        saveGroup.push({
            name: (this.state.saving ? "saving" : "save"),
            onClick: () => {
                if (!this.state.saving) {
                    this.setState({saving: true});
                    console.log("save button clicked");
                    this.props.onSave(() => {
                        this.setState({saving: false});
                        console.log("done saving");
                        if (this.props.onChange) {
                            console.log('puzzle saved!!');
                            this.props.onChange();
                        }
                    });
                }
            },
            isClicked: false,
            icon: "save",
            color: (this.state.saving ? "BDBDBD" : null)
        });
        if (this.props.editId && this.props.id) {
            saveGroup.push({
                name: "share",
                onClick: () => {
                    this.setState({modal: "SHARE"});
                },
                isClicked: false,
                icon: "link"
            });
        }

        return [
            [{
                name: "add box",
                onClick: () => {
                    this.setState({clickAction: 'CREATEBOX',
                        modal: null});
                },
                isClicked: this.state.clickAction === 'CREATEBOX',
                icon: 'add_box'
            },
            {
                name: "select",
                onClick: () => {
                    this.setState({clickAction: 'SELECT',
                        modal: null});
                },
                isClicked: this.state.clickAction === 'SELECT',
                icon: "touch_app"
            },
            {
                name: "color",
                onClick: () => {
                    this.setState({clickAction: 'COLOR', modal: null})
                },
                isClicked: this.state.clickAction === 'COLOR',
                icon: "palette"
            },
            {
                name: "shape",
                onClick: () => {
                    this.setState({clickAction: 'SHAPE', modal: null})
                },
                isClicked: this.state.clickAction === 'SHAPE',
                icon: "panorama_fish_eye"
            }

            ],
            saveGroup
        ];
    }

    handleClueUpdate(clue) {
        this.setState({
            selectedClue: this.state.selectedClue,
            modal: null
        });

        if (this.props.onChange) {
            console.log('clue updated!!');
            this.props.onChange();
        }
    }

    makeModal(modalType) {
        if (modalType === "SHARE") {
            return <EditableCrosswordShareModal editId={this.props.editId} id={this.props.id} dismissModal={() => {this.setState({modal: null})}}/>;
        } else if (modalType === "RELOAD") {
            return <EditableCrosswordReloadModal dismissModal={() => {this.setState({modal: null})}} accept={this.props.reload}/>;
        }
    }

    handleMetadataUpdate(event) {
        if (this.props.onMetadataUpdate) {
            this.props.onMetadataUpdate(event);
        }

        if (this.props.onChange) {
            console.log('metadata updated!!');
            this.props.onChange();
        }
    }



    render() {
        return (<div>
            {this.state.modal ? this.makeModal(this.state.modal) : ""}
            <EditableCrosswordTitle data={this.props.metadata} onUpdate={this.handleMetadataUpdate}/>
            <CrosswordHeader headerItems={this.getHeaderItems()} />
            <div className="crossword-container" >
                <div className="crossword-column-small" >
                    <EditableCrosswordClues style={{marginRight: "25px", float: "right"}} type='across' onClick={this.handleClueClick} onUpdate={this.handleClueUpdate} clues={this.state.clues.across} />
                </div>
                <div className="crossword-column-big" >
                    <CrosswordSelectedClue clue={this.getSelectedClue()} />
                    <CrosswordBoard onClick={this.handleBoxClick} board={this.state.board}/>
                    <EditableCrosswordMetadata data={this.props.metadata} onUpdate={this.handleMetadataUpdate} />
                </div>
                <div className="crossword-column-small" >
                    <EditableCrosswordClues type='down' style={{marginLeft: "25px", float: "left"}} onClick={this.handleClueClick} clues={this.state.clues.down} onUpdate={this.handleClueUpdate}/>
                </div>
            </div>
        </div>);
    }
}

EditableCrossword.propTypes = {
    game: React.PropTypes.instanceOf(Game).isRequired,
    metadata: React.PropTypes.instanceOf(Metadata).isRequired
};

module.exports = EditableCrossword;