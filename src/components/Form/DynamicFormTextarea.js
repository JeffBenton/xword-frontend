import React from 'react';
import FormHelper from './FormHelper.js';
import DynamicFormText from './DynamicFormText.js';

/**
 * Extends DynamicFormText. A multi-line text input.
 *
 * props:
 *      defaultHeight - number - the initial height for the textarea element (default: 50). note that the height
 *                               of this element adjusts with the number of lines in the textarea.
 *      defaultValue - string - the placeholder value for this text input (default: "none")
 *      title - string - the title that is rendered to the user for this form element (ex: First Name)
 *      name - string - a programmer-friendly name for this value (ex: firstName)
 *      value - node - the value for this element
 *      onUpdate - function - if the value changes due to user input, this function is called with the new
 *                            key-value pair
 */
class DynamicFormTextarea extends DynamicFormText {

    constructor(props) {
        super(props);
        this.state['height'] = props.defaultHeight + 'px';
    }

    /**
     *
     * Called when the input changes.
     *
     * The same handleChange as DynamicFormText, except now we should also scale the height of the input element
     * to the contents.
     *
     * @param event
     */
    handleChange(event) {
        super.handleChange(event);
        this.setState({height: event.target.scrollHeight});
    }

    /**
     * Called when a keydown event happens on the input.
     *
     * ENTER is a valid keypress on a textarea input, so we should only stop editing on ESC.
     *
     * @param event
     */
    handleKeydown(event) {
        if (event.which === 27) { // esc
            this.finishUpdate();
        }
    }

    /**
     * Render the textarea input element.
     *
     * @returns {XML}
     */
    renderDynamicElement() {
        if (!this.state.isEditing) {
            // when not editing, this is the same as a TEXT element
            return super.renderDynamicElement();
        } else {
            return <div className="value">
                    <textarea ref="edit" value={this.state.value} onChange={this.handleChange}
                              onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder={this.props.defaultValue}
                              style={{height: this.state.height + 'px'}}
                    />
            </div>;
        }
    }
}

DynamicFormTextarea.PropTypes = {
    defaultHeight: React.PropTypes.number
};

DynamicFormText.defaultProps = {
    defaultHeight: 50
};

module.exports = DynamicFormTextarea;

// register with the form lookup so we can create these
FormHelper.registerFormElement("textarea", DynamicFormTextarea);