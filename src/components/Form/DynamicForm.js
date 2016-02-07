/**
 *
 * @author alex
 */

import React from 'react';
import FormHelper from './FormHelper.js';
import './DynamicFormText.js';
import './DynamicFormRating.js';
import './DynamicFormDate.js';
import './DynamicFormTextarea.js';
import './DynamicForm.css';

/**
 * Dynamically creates a form based on a provided schema.
 *
 * props:
 *      className - string - used as the className for the css container for this form (default: dynamic-form-container)
 *      schema - list of objects - each schema object should have name, title, and 'type' (which can either be a dynamic
 *                                 form element key ex: 'text' or 'date' OR an object with element (the element key) and
 *                                 attributes properties). if the element can be edited, the schema should also provide
 *                                 an onUpdate callback. look at the propTypes for a better visual of this structure.
 *      values - object - the initial values for the schema elements in this form. should use the schema 'name' for keys.
 */
class DynamicForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var elements = [];
        for (let i = 0; i < this.props.schema.length; i++) {
            let elementSchema = this.props.schema[i];
            let elementType = elementSchema.type || "text";

            // create the props for the element (including the value)
            let elementProps = {
                name: elementSchema.name,
                title: elementSchema.title,
                onUpdate: elementSchema.onUpdate,
                value: this.props.values[elementSchema.name],
                key: i
            };

            // create the form element by getting the element from the FormHelper
            if (typeof elementType === "string") {
                elements.push(React.createElement(FormHelper.elementForType(elementType), elementProps));
            } else if (typeof elementType === "object") {
                // if we have attributes to pass to the form element, add them to the props
                elementType = elementSchema.type.element;
                elementProps.attributes = elementSchema.type.attributes;
                elements.push(React.createElement(FormHelper.elementForType(elementType), elementProps));
            } else {
                throw 'illegal schema passed to DynamicForm';
            }
        }
        return <div className={this.props.className}>{elements}</div>;
    }
}

DynamicForm.propTypes = {
    className: React.PropTypes.string,
    schema: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            name: React.PropTypes.string,
            title: React.PropTypes.string,
            type: React.PropTypes.oneOfType([
                React.PropTypes.string,
                React.PropTypes.shape({
                    element: React.PropTypes.string,
                    attributes: React.PropTypes.object
                })
            ]),
            onUpdate: React.PropTypes.func
    })).isRequired,
    values: React.PropTypes.object
};

DynamicForm.defaultProps = {
    className: "dynamic-form-container",
    values: {}
};

module.exports = DynamicForm;