import React from 'react';
import classNames from 'classnames';

/**
 * Base FormElement class to be used in a DynamicForm.
 *
 * Should be extended by components implementing specific element types.
 *
 * Handles basic functionality to all DynamicFormElements, ex:
 *      - renders the title element
 *      - has some basic click/edit handling (will only allow edits if onUpdate is provided)
 *
 * props:
 *      title - string - the title that is rendered to the user for this form element (ex: First Name)
 *      name - string - a programmer-friendly name for this value (ex: firstName)
 *      value - node - the value for this element
 *      onUpdate - function - if the value changes due to user input, this function is called with the new key-value pair
 */
class DynamicFormElement extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onClick = this.onClick.bind(this);

        // this element is only editable if onUpdate is provided via props.
        this.state = {
            value: this.props.value,
            isEditable: !!this.props.onUpdate,
            isEditing: false
        };
    }

    /**
     * Update the value if props change.
     *
     * @param props
     */
    componentWillReceiveProps(props) {
        this.setState({
            value: props.value
        });
    }

    /**
     * Basic click handling. If this element is editable, route the click event to the handler.
     *
     * @param event
     */
    onClick(event) {
        if (this.state.isEditable) {
            this.handleClick(event);
        }
    }

    /**
     * Handle a click event on this element. Extend for element-specific functionality.
     *
     * @param event
     */
    handleClick(event) {
        // no-operation. extend if needed.
    }

    /**
     * Handle a blur event on this element. Extend for element-specific functionality.
     *
     * @param event
     */
    handleBlur(event) {
        // no-operation. extend if needed.
    }

    /**
     * Handle a change of this element. Extend for element-specific functionality.
     *
     * @param event
     */
    handleChange(event) {
        // no-operation. extend if needed.
    }

    /**
     * Handle a keydown event on this element. Extend for element-specific functionality.
     *
     * @param event
     */
    handleKeydown(event) {
        // no-operation. extend if needed.
    }

    /**
     * Finish updating this element. Set the isEditing flag back to false, and call onUpdate with the
     * updated key/value pair.
     */
    finishUpdate() {
        if (this.state.isEditable) {
            this.setState({isEditing: false});
            // we send updates in the form of {name: value}.
            // this could allow us to update multiple values with a single form element in the future
            if (this.props.onUpdate) {
                let update = {};
                update[this.props.name] = this.state.value;
                this.props.onUpdate(update);
            }
        }
    }

    /**
     * Render the title element for this FormElement
     *
     * @returns {XML}
     */
    renderTitle() {
        return <div ref="title" className={classNames("title", {editing: this.state.isEditing})}>{this.props.title}</div>;
    }

    /**
     * Extend to render the specific DynamicElement determined by this implementation.
     */
    renderDynamicElement() {
        // no-operation. should be extended.
    }


    /**
     * Render the element. Delegates to renderTitle and renderDynamicElement.
     *
     * @returns {XML}
     */
    render() {
        return (<div className=
                         {classNames("dynamic-form-element", {editable: this.state.isEditable && !this.state.isEditing})}
        onClick={this.onClick}>
            {this.renderTitle()}
            {this.renderDynamicElement()}
        </div>);
    }
}

DynamicFormElement.propTypes = {
    title: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.node,
    onUpdate: React.PropTypes.func
};

module.exports = DynamicFormElement;