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
    }

    renderDynamicElement() {
        let valueToStars = () => {
            let elements = [];
            let count = this.props.value;
            for (let i = 0; i < 5; i++) {
                if (this.props.isEditing) {

                } else {
                    if (count >= 2) {
                        elements.push(
                            <i className="material-icons" key={i}>star</i>
                        );
                        count -= 2;
                    } else if (count >= 1) {
                        elements.push(<i className="material-icons" key={i}>star_half</i>);
                        count -= 1;
                    } else {
                        elements.push(<i className="material-icons" key={i}>star_border</i>
                        );
                    }
                }
            }
            return elements;
        };

        return (
            <div className="value">
                {valueToStars()}
            </div>);
    }

}

module.exports = DynamicFormRating;
Form.registerFormElement("rating", DynamicFormRating);