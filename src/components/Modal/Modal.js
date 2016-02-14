import React from 'react';
import './Modal.css';

/**
 * An extensible Modal component.
 *
 * Provides basic functionality (puts a box in the center of your screen,
 * and can optionally dismiss the modal by clicking outside of it).
 *
 * Extend this component and override getHeaderContent, getBodyContent, getFooterContent.
 *
 * props:
 *      shouldDismissOnClick - boolean - should this Modal be dismissed (dismissModal will be called)
 *                                       if the user clicks outside of the Modal?
 *      dismissModal - function - callback function that will be called when the Modal should be dismissed.
 */
class Modal extends React.Component {

    /**
     * Construct a Modal.
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.onBackgroundClick = this.onBackgroundClick.bind(this);
        this.state = {
            value: null
        };
    }

    /**
     * Click handler for this Modal.
     *
     * Determines if we clicked outside of the Modal. If we did, and
     * shouldDismissOnClick is true, dismiss the Modal.
     *
     * @param event
     *      the onclick event
     */
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

    /**
     * Extend this to add content to the Modal.
     *
     * @returns JSX/HTML content for the header of the Modal.
     */
    getHeaderContent() {
        // should be extended
    }

    /**
     * Extend this to add content to the Modal.
     *
     * @returns JSX/HTML content for the body of the Modal.
     */
    getBodyContent() {
        // should be extended
    }

    /**
     * Extend this to add content to the Modal.
     *
     * @returns JSX/HTML content for the footer of the Modal.
     */
    getFooterContent() {
        // should be extended
    }

    /**
     * When the modal mounts, prevent the body from scrolling (by adding a css class).
     */
    componentDidMount() {
        document.body.classList.add("modal-open");
    }

    /**
     * When the modal unmounts, re-enable scrolling (by removing a css class).
     */
    componentWillUnmount() {
        document.body.classList.remove("modal-open");
    }

    /**
     * Render the modal.
     *
     * @returns {XML}
     */
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

Modal.propTypes = {
    shouldDismissOnClick: React.PropTypes.bool,
    dismissModal: React.PropTypes.func
}

Modal.defaultProps = {
    shouldDismissOnClick: true
};

module.exports = Modal;