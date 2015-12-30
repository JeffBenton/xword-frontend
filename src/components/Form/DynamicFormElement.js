/**
 *
 * @author alex
 */

import React from 'react'

class DynamicFormElement extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onClick = this.onClick.bind(this);

        if (this.props.onUpdate) {
            this.state = {
                value: this.props.value,
                isEditable: true,
                isEditing: false
            }
        } else {
            this.state = {
                value: this.props.value,
                isEditable: false,
                isEditing: false
            }
        }
    }

    componentWillReceiveProps() {
        this.setState({
            value: this.props.value
        });
    }

    onClick() {
        // no-operation. extend if needed.
    }

    handleBlur() {
        // no-operation. extend if needed.
    }

    handleChange(event) {
        // no-operation. extend if needed.
    }

    handleKeydown(event) {
        // no-operation. extend if needed.
    }

    finishUpdate() {
        if (this.state.isEditable) {
            this.setState({isEditing: false});
            if (this.props.onUpdate) {
                let update = {};
                update[this.props.name] = this.state.value;
                this.props.onUpdate(update);
            }
        }
    }

    renderTitle() {
        return <div className="title">{this.props.title}</div>;
    }

    renderDynamicElement() {
        // no-operation. should be extended.
    }


    render() {
        return (<div className="dynamic-form-element" onClick={this.onClick}>
            {this.renderTitle()}
            {this.renderDynamicElement()}
        </div>);
    }
}

module.exports = DynamicFormElement;