import React from 'react';
import Modal from '../Modal/Modal.js';
import './EditableCrosswordReloadModal.css';

class EditableCrosswordReloadModal extends Modal {

    getHeaderContent() {
        return <div className="reload-modal-header">
            <span>Reload puzzle data from server?</span>
        </div>;
    }

    getBodyContent() {
        return <div className="reload-modal-body">
            <div style={{marginBottom: "3px"}}>
                <p>Are you sure you want to reload the data for this puzzle?</p>
                <p>Any unsaved progress will be lost.</p>
            </div>
        </div>;
    }

    getFooterContent() {
        return <div className="reload-modal-footer">
            <button onClick={this.props.dismissModal}>Cancel</button>
            <button onClick={this.props.accept}>Load data</button>
        </div>;
    }

}

module.exports = EditableCrosswordReloadModal;