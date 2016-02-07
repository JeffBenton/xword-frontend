/**
 *
 * @author alex
 */

import DynamicFormElement from './DynamicFormElement.js';
import classNames from 'classnames';
import React from 'react';
import FormHelper from './FormHelper.js';

class DynamicFormRating extends DynamicFormElement {

    constructor(props) {
        super(props);
        this.handleMouseover = this.handleMouseover.bind(this);
        this.handleMouseout = this.handleMouseout.bind(this);
        this.state['tempValue'] = this.props.value;
    }

    handleClick(event) {
        if (this.state.isEditing) {
            this.finishUpdate();
            this.handleChange();
        } else {
            this.setState({
                isEditing: true,
                startEditing: true
            });
        }
    }

    finishUpdate() {
        this.setState({isEditing: false});
    }

    handleChange() {
        if (this.props.onUpdate) {
            let update = {};
            update[this.props.name] = this.state.tempValue;
            this.props.onUpdate(update);
        }
    }

    componentDidMount() {
        window.addEventListener("click", this.handleBlur);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.handleBlur);
    }


    handleMouseover(event) {
        let getValueFromIcon = (icon) => {
            for (let key in this.refs) {
                if (this.refs.hasOwnProperty(key) && icon == this.refs[key]) {
                    return key * 2;
                }
            }
            return 0;
        };
        let mouseX = event.clientX;
        let icon = event.target.getBoundingClientRect();
        if (mouseX < (icon.left + (icon.width / 3))) {
            this.setState({tempValue: getValueFromIcon(event.target)});
        } else if (mouseX < (icon.left + (icon.width * 2 / 3))) {
            this.setState({tempValue: getValueFromIcon(event.target) + 1});
        } else {
            this.setState({tempValue: getValueFromIcon(event.target) + 2});
        }
    }

    handleMouseout() {
        this.setState({tempValue: this.props.value});
    }

    /**
     * Handle the 'blur' event.
     *
     * The DynamicFormRating element doesn't actually have an input to track the blur event, so we simulate it
     * by checking if the user clicked anywhere outside this element.
     *
     * @param event
     */
    handleBlur(event) {
        var isThisElement = (element) => {
            for (let key in this.refs) {
                if (element == this.refs[key]) {
                    return true;
                }
            }
            return false;
        };

        if (this.state.isEditing && !isThisElement(event.target)) {
            this.finishUpdate();
        }
    }


    renderDynamicElement() {
        let valueToStars = () => {
            let elements = [];
            let count = this.state.isEditing ? this.state.tempValue : this.props.value;
            for (let i = 0; i < 5; i++) {
                if (this.state.isEditing) {
                    if (count >= 2) {
                        elements.push(
                            <i className="material-icons" onMouseOut={this.handleMouseout} onMouseMove={this.handleMouseover} key={i} ref={i}>star</i>
                        );
                        count -= 2;
                    } else if (count >= 1) {
                        elements.push(<i className="material-icons" onMouseOut={this.handleMouseout} onMouseMove={this.handleMouseover} key={i} ref={i}>star_half</i>);
                        count -= 1;
                    } else {
                        elements.push(<i className="material-icons" onMouseOut={this.handleMouseout} onMouseMove={this.handleMouseover} key={i} ref={i}>star_border</i>
                        );
                    }
                } else {
                    if (count >= 2) {
                        elements.push(
                            <i className="material-icons" key={i} ref={i}>star</i>
                        );
                        count -= 2;
                    } else if (count >= 1) {
                        elements.push(<i className="material-icons" key={i} ref={i}>star_half</i>);
                        count -= 1;
                    } else {
                        elements.push(<i className="material-icons" key={i} ref={i}>star_border</i>
                        );
                    }
                }
            }
            return elements;
        };

        return (
            <div ref="value" className={classNames("value", {editing: this.state.isEditing})}>
                {valueToStars()}
            </div>);
    }

}

module.exports = DynamicFormRating;
FormHelper.registerFormElement("rating", DynamicFormRating);