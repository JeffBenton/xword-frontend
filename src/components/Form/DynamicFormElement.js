/**
 *
 * @author alex
 */

import React from 'react';
import classNames from 'classnames';

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
        }
    }

    renderTitle() {
        return <div ref="title" className={classNames("title", {editing: this.state.isEditing})}>{this.props.title}</div>;
    }

    renderDynamicElement() {
        // no-operation. should be extended.
    }


    render() {
        return (<div className=
                         {classNames("dynamic-form-element", {editable: this.state.isEditable && !this.state.isEditing})}
                     onClick={this.onClick}>
            {this.renderTitle()}
            {this.renderDynamicElement()}
        </div>);
    }
}

module.exports = DynamicFormElement;