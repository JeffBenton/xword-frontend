/**
 *
 * @author alex
 */

import DynamicFormText from './DynamicFormText.js';
import React from 'react';
import Form from './Form.js';

class DynamicFormDate extends DynamicFormText {

    constructor(props) {
        super(props);
    }
}

module.exports = DynamicFormDate;
Form.registerFormElement("date", DynamicFormDate);