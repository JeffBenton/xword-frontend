/**
 *
 * @author alex
 */

import React from 'react';
import FormHelper from './FormHelper.js';
import DynamicFormElement from './DynamicFormElement.js';

class DynamicFormText extends DynamicFormElement {

    constructor(props) {
        super(props);
        this.DEFAULT_VALUE = "none";
    }

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

    finishUpdate() {
        super.finishUpdate();
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
        let value = event.target.value;
        if (!value.trim()) {
            value = null;
            event.target.value = value;
            this.setState({value: ""});
        } else {
            this.setState({value: value});
        }
    }

    componentDidUpdate() {
        if (this.state.isEditing) {
            this.refs.edit.focus();

            // hack to always put the cursor at the end of the value
            if (this.state.startEditing) {
                let val = this.refs.edit.value;
                this.refs.edit.value = "";
                this.refs.edit.value = val;
                this.setState({startEditing: false});
            }
        }
    }

    renderDynamicElement() {
        if (!this.state.isEditing) {
            return <div className="value">{this.state.value || this.DEFAULT_VALUE}</div>;
        } else {
            return <div className="value">
                <input type="text" ref="edit" value={this.state.value} onChange={this.handleChange}
                       onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder={this.DEFAULT_VALUE}/>
            </div>;
        }
    }
}

module.exports = DynamicFormText;
FormHelper.registerFormElement("text", DynamicFormText);