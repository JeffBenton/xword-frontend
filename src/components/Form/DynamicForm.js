/**
 *
 * @author alex
 */

import React from 'react';
import Form from './Form.js';
import './form_require.js';
import './DynamicForm.css';

class DynamicForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var elements = [];
        for (let i = 0; i < this.props.schema.length; i++) {
            let elementSchema = this.props.schema[i];
            let elementType = elementSchema.type || "text";
            let elementProps = {
                name: elementSchema.name,
                title: elementSchema.title,
                onUpdate: elementSchema.onUpdate,
                value: this.props.values[elementSchema.name],
                key: i
            };
            if (typeof elementType === "string") {
                elements.push(React.createElement(Form.elementForType(elementType), elementProps));
            } else if (typeof elementType === "object") {
                elementType = elementSchema.type.element;
                elementProps.attributes = elementSchema.type.attributes;
                elements.push(React.createElement(Form.elementForType(elementType), elementProps));
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