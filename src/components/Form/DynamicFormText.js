/**
 *
 * @author alex
 */

import React from 'react';
import Form from './Form.js';
import DynamicFormElement from './DynamicFormElement.js';

class DynamicFormText extends DynamicFormElement {

    constructor(props) {
        super(props);
        console.log(this.state);
    }

    onClick(event) {
        if (this.state.isEditing) {
            this.finishUpdate();
        } else {
            this.setState({
                isEditing: true
            });
        }
    }

    handleBlur(event) {
        this.finishUpdate();
    }

    handleKeydown(event) {
        if (event.which === 13 || event.which === 27) {
            this.finishUpdate();
        }
    }

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

    renderDynamicElement() {
        return <div className="value"></div>
    }
}

Form.registerFormElement("text", DynamicFormText);