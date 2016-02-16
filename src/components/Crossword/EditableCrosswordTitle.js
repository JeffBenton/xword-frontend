import CrosswordTitle from './CrosswordTitle.js'
import React from 'react';
import Metadata from './../../objects/metadata.js';
import './CrosswordTitle.css';

/**
 * The EditableCrosswordTitle component. Extends CrosswordTitle and displays the title of this crossword
 * puzzle, with 'created by' and 'edited by' subtitles.
 *
 * Adds edit functionality to the element, allowing the title to be edited and updated.
 *
 * props:
 *      data - Metadata - the metadata object for this Crossword. used to show the title/author/editor.
 *      defaultTitle - string - the placeholder string to display if there's no title. default: 'Untitled Crossword'
 *      onUpdate - function - callback function to update the edited title
 */
class EditableCrosswordTitle extends CrosswordTitle {

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            title: this.props.data != null ? this.props.data.title : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Called when this element gets clicked.
     *
     * Toggle editing of this element.
     */
    onClick() {
        if (this.state.isEditing) {
            this.finishUpdate();
        } else {
            this.setState({
                isEditing: true,
                startEditing: true
            });
        }
    }

    /**
     * Called when a blur event happens on the input.
     *
     * Finish updating this element.
     *
     * @param event
     */
    handleBlur() {
        this.finishUpdate();
    }

    /**
     * Called when the title changes.
     *
     * Due to how React handles inputs, we have to maintain the input value in state.
     *
     * @param event
     */
    handleChange(event) {
        if (!event.target.value.trim()) {
            event.target.value = null;
            event.target.text = "";
            this.setState({title: null});
        } else {
            event.target.text = event.target.value;
            this.setState({title: event.target.value});
        }
    }

    /**
     * Called when a keydown event happens on the input.
     *
     * If ENTER or ESC are pressed, stop editing.
     *
     * @param event
     */
    handleKeydown(event) {
        if (event.which === 13 || event.which === 27) {
            this.finishUpdate();
        }
    }

    /**
     * Finish updating this element. Set the isEditing flag back to false, and call onUpdate with the
     * update object.
     *
     * The update object will have the form: {title: value}
     */
    finishUpdate() {
        this.setState({isEditing: false});
        if (this.props.onUpdate) {
            this.props.onUpdate({title: this.state.title});
        }
    }

    /**
     * Hook into the 'componentDidUpdate' lifecycle method for some QOL improvements.
     */
    componentDidUpdate() {
        if (this.state.isEditing) {
            this.refs.edit.focus();

            // hack to put the cursor at the end of the value
            // we only want to do this once when we start editing
            if (this.state.startEditing) {
                let val = this.refs.edit.value;
                this.refs.edit.value = "";
                this.refs.edit.value = val;
                this.setState({startEditing: false});
            }
        }
    }

    /**
     * Render the EditableCrosswordTitle element.
     *
     * @returns {XML}
     */
    render() {
        return  <div className="crossword-title-container editable">
                    <div className="title">
                        {
                            // if we're editing, render a 'input' element
                            this.state.isEditing ?
                            <input type="text" ref="edit"
                               value={this.state.title}
                               onChange={this.handleChange}
                               onKeyDown={this.handleKeydown}
                               onBlur={this.handleBlur}
                               placeholder={this.props.defaultTitle}/> :
                            // else, render a 'span' element
                            <span onClick={this.onClick}>{this.state.title || this.props.defaultTitle}</span>
                        }
                    </div>
                    {
                        // if we have metadata, add it to the element
                        this.props.data ?
                        <div className="metadata">
                            {
                                // if we have an author, show it
                                (this.props.data && this.props.data.author) ?
                                <div>
                                    <span className="field">created by</span>
                                    <span className="value">{this.props.data.author}</span>
                                </div> : ""
                            }
                            {
                                // if we have an editor, show it
                                (this.props.data && this.props.data.editor) ?
                                <div>
                                    <span className="field">edited by</span>
                                    <span className="value">{this.props.data.editor}</span>
                                </div> : ""
                            }
                        </div> : ""
                    }
                </div>;
    }
}

EditableCrosswordTitle.propTypes = {
    onUpdate: React.PropTypes.func
};

module.exports = EditableCrosswordTitle;