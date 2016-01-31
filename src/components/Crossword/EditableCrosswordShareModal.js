import React from 'react';
import Modal from '../Modal/Modal.js';
import './EditableCrosswordShareModal.css';

class EditableCrosswordShareModal extends Modal {

    getHeaderContent() {
        return <div className="share-modal-header">
            <span>Shareable crossword links</span>
        </div>;
    }

    getEditLink() {
        return location.origin + "/edit/" + this.props.editId;
    }

    getSolveLink() {
        return location.origin + "/solve/" + this.props.id;
    }

    getBodyContent() {
        return <div className="share-modal-body">
            <div style={{marginBottom: "3px"}}><span>Anyone with this link can <span className="edit">edit</span> this puzzle:</span></div>
            <div style={{marginBottom: "10px"}}><input type="text" readOnly value={this.getEditLink()} className="edit" onClick={this.onInputClick} /></div>
            <div style={{marginBottom: "3px"}}><span>Anyone with this link can <span className="solve">solve</span> this puzzle:</span></div>
            <div><input type="text" readOnly className="solve" value={this.getSolveLink()} onClick={this.onInputClick} /></div>
        </div>;
    }

    onInputClick(event) {
        console.log('clicked');
        event.target.select();
        document.execCommand('copy');
    }

    getFooterContent() {
        return <div className="share-modal-footer" onClick={this.props.dismissModal}>
            <span>Got it!</span>
        </div>;
    }

}

module.exports = EditableCrosswordShareModal;