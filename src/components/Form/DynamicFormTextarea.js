/**
 *
 * @author alex
 */

import React from 'react';
import Form from './Form.js';
import DynamicFormText from './DynamicFormText.js';

class DynamicFormTextarea extends DynamicFormText {

    constructor(props) {
        super(props);
        this.DEFAULT_VALUE = "none";
        this.state['height'] = "50px";
    }

    handleChange(event) {
        super.handleChange(event);
        this.setState({height: event.target.scrollHeight});
    }

    handleKeydown(event) {
        if (event.which === 27) {
            this.finishUpdate();
        }
    }

    renderDynamicElement() {
        if (!this.state.isEditing) {
            return super.renderDynamicElement();
        } else {
            return <div className="value">
                    <textarea ref="edit" value={this.state.value} onChange={this.handleChange}
                              onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder={this.DEFAULT_VALUE}
                              style={{height: this.state.height + 'px'}}
                    />
            </div>;
        }
    }
}

module.exports = DynamicFormTextarea;
Form.registerFormElement("textarea", DynamicFormTextarea);