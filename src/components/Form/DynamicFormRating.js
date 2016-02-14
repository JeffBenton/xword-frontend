import DynamicFormElement from './DynamicFormElement.js';
import classNames from 'classnames';
import React from 'react';
import FormHelper from './FormHelper.js';


/**
 * A 'rating' element. Represents an integer value in 'stars' form. Mouse-over the stars to select the value.
 *
 * props:
 *      title - string - the title that is rendered to the user for this form element (ex: Difficulty)
 *      name - string - a programmer-friendly name for this value (ex: difficulty)
 *      value - number - a number
 *      onUpdate - function - if the value changes due to user input, this function is called with the new
 *                            key-value pair
 *      maxValue - number - the maximum value for this form element. Default 10 (which translates to 5 stars).
 *                          Should be an even number.
 */
class DynamicFormRating extends DynamicFormElement {

    constructor(props) {
        super(props);
        this.handleMouseover = this.handleMouseover.bind(this);
        this.handleMouseout = this.handleMouseout.bind(this);
        this.state['tempValue'] = this.props.value;
    }

    /**
     * Handle a click event on this element.
     *
     * Toggle editing of this element.
     *
     * @param event
     */
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

    /**
     * Finish updating this element.
     *
     * Set the isEditing flag back to false.
     */
    finishUpdate() {
        this.setState({isEditing: false});
    }

    /**
     * Handle a change of this element.
     *
     * Updates the value.
     */
    handleChange() {
        if (this.props.onUpdate) {
            let update = {};
            update[this.props.name] = this.state.tempValue;
            this.props.onUpdate(update);
        }
    }

    /**
     * Add a click listener when this component mounts. This is used to deactivate this element
     * when the user clicks outside of it.
     */
    componentDidMount() {
        window.addEventListener("click", this.handleBlur);
    }

    /**
     * Remove the click listener.
     */
    componentWillUnmount() {
        window.removeEventListener("click", this.handleBlur);
    }


    /**
     * When a user mouses over this element (and is editing), we should visually select stars.
     *
     * @param event
     */
    handleMouseover(event) {

        /**
         * Decide what the temporary value should be based on the star that we're mousing over.
         *
         * @param icon
         * @returns {number}
         */
        let getValueFromIcon = (icon) => {
            for (let key in this.refs) {
                if (this.refs.hasOwnProperty(key) && icon == this.refs[key]) {
                    return key * 2;
                }
            }
            return 0;
        };

        // get the position of the mouse on this star
        let mouseX = event.clientX;
        let icon = event.target.getBoundingClientRect();

        // divide the star into thirds.
        if (mouseX < (icon.left + (icon.width / 3))) {
            // first third: this star isn't selected
            this.setState({tempValue: getValueFromIcon(event.target)});
        } else if (mouseX < (icon.left + (icon.width * 2 / 3))) {
            // second third: half of this star is selected
            this.setState({tempValue: getValueFromIcon(event.target) + 1});
        } else {
            // third third: the full star is selected
            this.setState({tempValue: getValueFromIcon(event.target) + 2});
        }
    }

    /**
     * If the mouse leaves the element while we're editing, revert the value to the last saved value.
     */
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

        /**
         * Is the provided element part of this Rating element?
         *
         * @param element
         * @returns {boolean}
         */
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

    /**
     * Render the rating input element.
     *
     * @returns {XML}
     */
    renderDynamicElement() {

        /**
         * Create the correct number of star elements for this rating element.
         *
         * @returns {Array}
         */
        let valueToStars = () => {
            let elements = [];

            // decide which value to use
            let count = this.state.isEditing ? this.state.tempValue : this.props.value;

            for (let i = 0; i < this.props.maxValue/2; i++) {
                if (this.state.isEditing) {
                    // if we're editing, our icons need mouse events.
                    if (count >= 2) {
                        // make complete stars until we run out of value
                        elements.push(
                            <i className="material-icons" onMouseOut={this.handleMouseout} onMouseMove={this.handleMouseover} key={i} ref={i}>star</i>
                        );
                        count -= 2;
                    } else if (count >= 1) {
                        // if we have a leftover value after making complete stars, make a half star
                        elements.push(<i className="material-icons" onMouseOut={this.handleMouseout} onMouseMove={this.handleMouseover} key={i} ref={i}>star_half</i>);
                        count -= 1;
                    } else {
                        // make empty stars until we hit maxValue/2
                        elements.push(<i className="material-icons" onMouseOut={this.handleMouseout} onMouseMove={this.handleMouseover} key={i} ref={i}>star_border</i>
                        );
                    }
                } else {
                    if (count >= 2) {
                        // make complete stars until we run out of value
                        elements.push(<i className="material-icons" key={i} ref={i}>star</i>);
                        count -= 2;
                    } else if (count >= 1) {
                        // if we have a leftover value after making complete stars, make a half star
                        elements.push(<i className="material-icons" key={i} ref={i}>star_half</i>);
                        count -= 1;
                    } else {
                        // make empty stars until we hit maxValue/2

                        elements.push(<i className="material-icons" key={i} ref={i}>star_border</i>);
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

DynamicFormRating.propTypes = {
    maxValue: React.PropTypes.number
};

DynamicFormRating.defaultProps = {
    maxValue: 10
};

module.exports = DynamicFormRating;
FormHelper.registerFormElement("rating", DynamicFormRating);