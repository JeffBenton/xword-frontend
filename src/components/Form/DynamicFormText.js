import React from 'react';
import FormHelper from './FormHelper.js';
import DynamicFormElement from './DynamicFormElement.js';

/**
 * A basic text form element.
 *
 * props:
 *      defaultValue - string - the placeholder value for this date input (default: "none")
 *      title - string - the title that is rendered to the user for this form element (ex: Date)
 *      name - string - a programmer-friendly name for this value (ex: date)
 *      value - node - the value for this element
 *      onUpdate - function - if the value changes due to user input, this function is called with the new
 *                            key-value pair
 *
 */
class DynamicFormText extends DynamicFormElement {

    constructor(props) {
        super(props);
    }

    /**
     * Called when this element gets clicked. This can only trigger if this element is
     * editable.
     *
     * Toggle editing of this element.
     *
     * @param event
     */
    handleClick(event) {
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
    handleBlur(event) {
        this.finishUpdate();
    }

    /**
     * Called when a keydown event happens on the input.
     *
     * If ENTER or ESC are pressed, stop editing.
     *
     * @param event
     */
    handleKeydown(event) {
        if (event.which === 13 || event.which === 27) { // enter or esc
            this.finishUpdate();
        }
    }

    /**
     * Called when the input changes.
     *
     * Due to how React handles inputs, we have to maintain the input value in state.
     *
     * @param event
     */
    handleChange(event) {
        let value = event.target.value;
        if (!value.trim()) {
            value = null;
            event.target.value = value;
            this.setState({value: ""});
        } else {
            this.setState({value: value});
        }
    }

    /**
     * Hook into the 'componentDidUpdate' lifecycle method for some QOL improvements.
     */
    componentDidUpdate() {
        // focus on the input when we start editing
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
     * Render the text input element.
     *
     * @returns {XML}
     */
    renderDynamicElement() {
        if (!this.state.isEditing) {
            return <div className="value">{this.state.value || this.props.defaultValue}</div>;
        } else {
            return <div className="value">
                <input type="text" ref="edit" value={this.state.value} onChange={this.handleChange}
                       onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder={this.props.defaultValue}/>
            </div>;
        }
    }
}

DynamicFormText.PropTypes = {
    defaultValue: React.PropTypes.string
};

DynamicFormText.defaultProps = {
    defaultValue: "none"
};

module.exports = DynamicFormText;

// register with the form lookup so we can create these
FormHelper.registerFormElement("text", DynamicFormText);