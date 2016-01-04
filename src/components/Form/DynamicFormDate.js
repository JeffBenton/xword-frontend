/**
 *
 * @author alex
 */

import DynamicFormText from './DynamicFormText.js';
import React from 'react';
import Form from './Form.js';
import {sleep} from './../../util/util.js';

class DynamicFormDate extends DynamicFormText {

    constructor(props) {
        super(props);
        var value = new Date(props.value);
        this.state = {
            isEditing: false,
            startEditing: false,
            day: value.getUTCDate(),
            month: value.getUTCMonth() + 1,
            year: value.getUTCFullYear()
        };
    }

    onClick(event) {
        if (!this.state.isEditing) {
            this.setState({
                isEditing: true,
                startEditing: true
            });
        }
    }

    finishUpdate() {
        this.setState({
            isEditing: false
        });
    }

    async handleBlur(event) {
        await sleep(10);
        if (document.activeElement != this.refs.editmonth && document.activeElement != this.refs.editday && document.activeElement != this.refs.edityear) {
            super.handleBlur(event);
        }
    }

    handleChange(event) {
        let determineChangedField = function(element, refs) {
            switch (element) {
                case refs.editmonth:
                    return 'month';
                case refs.editday:
                    return 'day';
                case refs.edityear:
                    return 'year';
                default:
                    return null;
            }
        };
        let value = event.target.value;
        let field = determineChangedField(document.activeElement, this.refs);
        if (!field) {
            return;
        }

        let stateChange = {};
        if (!value.trim()) {
            value = null;
            event.target.value = value;
            event.target.text = "";
            stateChange[field] = null;
            this.setState(stateChange);
        } else {
            event.target.text = value;
            stateChange[field] = value;
            this.setState(stateChange);
        }
        if (this.props.onUpdate) {
            let update = {};
            update[this.props.name] = new Date(this.state.year, this.state.month, this.state.day);
            this.props.onUpdate(update);
        }
    }

    componentDidUpdate() {
        if (this.state.isEditing) {

            // hack to always put the cursor at the end of the value
            if (this.state.startEditing) {
                this.refs.editmonth.focus();
                let val = this.refs.editmonth.value;
                this.refs.editmonth.value = "";
                this.refs.editmonth.value = val;
                this.setState({startEditing: false});
            }
        }
    }

    getMaxDayByMonth() {
        return 31;
    }

    getCurrentYear() {
        return new Date().getUTCFullYear();
    }


    renderDynamicElement() {
        var getDisplayValue = function(state) {
            if (!state.month || !state.day || !state.year) {
                return null;
            }
            return state.month + " / " + state.day + " / " + state.year;
        };
        if (!this.state.isEditing) {
            return <div className="value">{getDisplayValue(this.state) || this.DEFAULT_VALUE}</div>;
        } else {
            return <div className="date"><div className="value" style={{display: 'flex'}}>
                <input type="number" min={1} max={12} ref="editmonth" value={this.state.month} onChange={this.handleChange} onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder='MM'/>
                <span> / </span>
                <input type="number" min={1} max={this.getMaxDayByMonth()} ref="editday" value={this.state.day} onChange={this.handleChange} onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder='DD'/>
                <span> / </span>
                <input type="number" maxLength={4} min={1980} max={this.getCurrentYear()} ref="edityear" value={this.state.year} onChange={this.handleChange} onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder='YYYY'/>
            </div></div>;
        }
    }
}

module.exports = DynamicFormDate;
Form.registerFormElement("date", DynamicFormDate);