import React from 'react';
import './Modal.css';

/**
 *
 * @author alex
 */
class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.onBackgroundClick = this.onBackgroundClick.bind(this);
        this.state = {
            value: null
        };
    }

    onBackgroundClick(event) {
        if (this.props.shouldDismissOnClick) {
            let children = [];
            let addAll = (htmlCollection) => {
                if (!htmlCollection) {
                    return;
                }

                for (let i = 0; i < htmlCollection.length; i++) {
                    children.push(htmlCollection.item(i));
                }
            };
            addAll(this.refs.modal.children);
            for (let i = 0; i < children.length; i++) {
                if (event.target === children[i]) {
                    return;
                }
                addAll(children[i].children);
            }
            this.props.dismissModal(this.state.value);
        }
    }

    getHeaderContent() {
        // should be extended
    }

    getBodyContent() {
        // should be extended
    }

    getFooterContent() {
        // should be extended
    }

    render() {
        return <div className="modal-background" onClick={this.onBackgroundClick}>
            <div className="modal" ref="modal">
                <div className="header">
                    {this.getHeaderContent()}
                </div>
                <div className="body">
                    {this.getBodyContent()}
                </div>
                <div className="footer">
                    {this.getFooterContent()}
                </div>
            </div>
        </div>;
    }
}

Modal.defaultProps = {
    shouldDismissOnClick: true
};

module.exports = Modal;