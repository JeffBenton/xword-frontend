import DynamicFormText from './DynamicFormText.js';
import React from 'react';
import FormHelper from './FormHelper.js';
import {sleep} from './../../util/util.js';


/**
 * Extends DynamicFormText. A Date input.
 *
 * props:
 *      defaultHeight - number - the initial height for the textarea element (default: 50). note that the height
 *                               of this element adjusts with the number of lines in the textarea.
 *      defaultValue - string - the placeholder value for this text input (default: "none")
 *      title - string - the title that is rendered to the user for this form element (ex: First Name)
 *      name - string - a programmer-friendly name for this value (ex: firstName)
 *      value - number - a date in number (ms since epoch) form
 *      onUpdate - function - if the value changes due to user input, this function is called with the new
 *                            key-value pair
 */
class DynamicFormDate extends DynamicFormText {

    constructor(props) {
        super(props);
        this.state['startEditing'] = false;

        // convert the value into day/month/year
        if (props.value) {
            var value = new Date(props.value);
            this.state['day'] = value.getUTCDate();
            this.state['month'] = value.getUTCMonth() + 1;
            this.state['year'] = value.getUTCFullYear();
        }
    }

    /**
     * When we click on this element, start editing.
     *
     * @param event
     */
    handleClick(event) {
        if (!this.state.isEditing) {
            this.setState({
                isEditing: true,
                startEditing: true
            });
        }
    }

    /**
     * When we finish updating, stop editing.
     */
    finishUpdate() {
        this.setState({
            isEditing: false
        });
    }

    /**
     * Handle a blur event.
     *
     * If we're moving between the different inputs within this element, do nothing. Otherwise, stop editing.
     *
     * @param event
     */
    async handleBlur(event) {
        await sleep(10);
        if (document.activeElement != this.refs.editmonth && document.activeElement != this.refs.editday && document.activeElement != this.refs.edityear) {
            super.handleBlur(event);
        }
    }

    /**
     * Validate the day/month/year values to ensure we have a valid date.
     *
     * @param value
     * @param field 'day'/'month'/'year'
     * @returns {boolean} true if the value is invalid, false otherwise
     */
    isInvalidFieldValue(value, field) {
        switch (field) {
            case 'month':
                return value < 0 || value > 12;
            case 'day':
                return value < 0 || value > this.getMaxDayByMonth(this.state.month, this.state.year);
            case 'year':
                return value < 0 || value > this.getCurrentYear();
            default:
                return false;
        }

    }

    /**
     * Called when a value changes.
     *
     * Validate the changed value and update the element.
     *
     * @param event
     */
    handleChange(event) {

        /**
         * Helper function to determine which field changed.
         *
         * @param element the activeElement
         * @param refs the refs for this DynamicFormDate
         * @returns {*} 'month'/'day'/'year', depending on which field changed
         */
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
        if (!field || this.isInvalidFieldValue(value, field)) {
            return;
        }

        // update whichever value changed
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

        // propagate the changed value. convert the day/month/year back to ms before updating.
        if (this.props.onUpdate && value != null) {
            let update = {};
            let date = {year: this.state.year, month: this.state.month, day: this.state.day};
            date[field] = parseInt(value);
            update[this.props.name] = new Date(date.year, date.month - 1, date.day).valueOf();
            this.props.onUpdate(update);
        }
    }

    /**
     * QOL improvement to ensure that when we start editing, the cursor is in the correct location.
     */
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

    /**
     * Get the largest possible day value for a given month.
     *
     * @param month
     * @param year
     * @returns {number}
     */
    getMaxDayByMonth(month, year) {
        return new Date(year || this.getCurrentYear(), month || 1, 0).getUTCDate();
    }

    /**
     * Get the current year.
     *
     * @returns {number}
     */
    getCurrentYear() {
        return new Date().getUTCFullYear();
    }


    /**
     * Render the date input element.
     *
     * @returns {XML}
     */
    renderDynamicElement() {

        /**
         * Get the value to display for the element based on the current state.
         *
         * @returns {*} a string representing the value of this element
         */
        var getDisplayValue = () => {
            if (!this.state.month || !this.state.day || !this.state.year) {
                return null;
            }
            return this.state.month + " / " + this.state.day + " / " + this.state.year;
        };

        if (!this.state.isEditing) {
            return <div className="value">{getDisplayValue() || this.props.defaultValue}</div>;
        } else {
            return <div className="date">
                <div className="value">
                    <input
                        type="number"
                        min={1}
                        max={12}
                        ref="editmonth"
                        value={this.state.month}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeydown}
                        onBlur={this.handleBlur}
                        placeholder='MM'/>
                    <input
                        type="number"
                        min={1}
                        max={this.getMaxDayByMonth()}
                        ref="editday"
                        value={this.state.day}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeydown}
                        onBlur={this.handleBlur}
                        placeholder='DD'/>
                    <input type="number"
                           maxLength={4}
                           min={1980}
                           max={this.getCurrentYear()}
                           ref="edityear"
                           value={this.state.year}
                           onChange={this.handleChange}
                           onKeyDown={this.handleKeydown}
                           onBlur={this.handleBlur}
                           placeholder='YYYY'/>
                </div>
            </div>;
        }
    }
}

module.exports = DynamicFormDate;
FormHelper.registerFormElement("date", DynamicFormDate);