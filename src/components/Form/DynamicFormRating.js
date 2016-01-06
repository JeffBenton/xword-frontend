/**
 *
 * @author alex
 */

import DynamicFormElement from './DynamicFormElement.js';
import React from 'react';
import Form from './Form.js';

class DynamicFormRating extends DynamicFormElement {

    constructor(props) {
        super(props);
        this.handleMouseover = this.handleMouseover.bind(this);
        this.handleMouseout = this.handleMouseout.bind(this);
        this.handleIconClick = this.handleIconClick.bind(this);
    }

    onClick(event) {
        if (this.state.isEditing) {
            this.finishUpdate();
        } else {
            this.setState({
                isEditing: true,
                startEditing: true
            });
        }
    }

    componentDidMount() {
        window.addEventListener("click", this.handleBlur);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.handleBlur);
    }


    handleMouseover(event) {
        console.log(event.clientX);
        console.log(event.clientY);
        console.log(event.target.getBoundingClientRect());
    }

    handleMouseout(event) {
        console.log(event);
    }

    handleIconClick(event) {
        event.preventDefault();
        console.log(event);
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
            let count = this.props.value;
            for (let i = 0; i < 5; i++) {
                if (this.state.isEditing) {
                    if (count >= 2) {
                        elements.push(
                            <i className="material-icons" onMouseMove={this.handleMouseover} onMouseOut={this.handleMouseout} onClick={this.handleIconClick} key={i} ref={i}>star</i>
                        );
                        count -= 2;
                    } else if (count >= 1) {
                        elements.push(<i className="material-icons" onMouseMove={this.handleMouseover} onMouseOut={this.handleMouseout} onClick={this.handleIconClick} key={i} ref={i}>star_half</i>);
                        count -= 1;
                    } else {
                        elements.push(<i className="material-icons" onMouseMove={this.handleMouseover} onMouseOut={this.handleMouseout} onClick={this.handleIconClick} key={i} ref={i}>star_border</i>
                        );
                    }
                } else {
                    if (count >= 2) {
                        elements.push(
                            <i className="material-icons" onClick={this.handleIconClick} key={i} ref={i}>star</i>
                        );
                        count -= 2;
                    } else if (count >= 1) {
                        elements.push(<i className="material-icons" onClick={this.handleIconClick} key={i} ref={i}>star_half</i>);
                        count -= 1;
                    } else {
                        elements.push(<i className="material-icons" onClick={this.handleIconClick} key={i} ref={i}>star_border</i>
                        );
                    }
                }
            }
            return elements;
        };

        return (
            <div ref="value" className="value">
                {valueToStars()}
            </div>);
    }

}

module.exports = DynamicFormRating;
Form.registerFormElement("rating", DynamicFormRating);