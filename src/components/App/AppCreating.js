import React from 'react';
import './AppCreating.css';

/**
 * A form to allow the user to specify the height and with of a crossword puzzle that they're creating.
 *
 * props:
 *      min - number - the minimum value for puzzle height and width (default 5)
 *      max - number - the maximum value for puzzle height and width (default 25)
 *      onSubmit - function - callback function to call when this form submits
 */
class AppCreating extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.state = {
            width: 15,
            height: 15
        };
    }

    /**
     * Handle submitting the form. Calls the onSubmit callback function with the height and width from the form.
     */
    handleClick() {
        this.props.onSubmit({height: this.state.height, width: this.state.width});
    }

    /**
     * Handle a change event on the form inputs.
     *
     * Ensure we have sane values in the elements. Update the input elements with new input. Update the state of
     * this component on change.
     *
     * @param event
     */
    onChange(event) {
        // if this isn't an int (or null) we shouldn't do anything
        if (this.isInt(event.target.value)) {
            let value = parseInt(event.target.value);
            if (value < 100 && value >= 0) {
                // figure out whether we should update the width or height
                if (event.target === this.refs.width) {
                    this.setState({width: value});
                } else if (event.target === this.refs.height) {
                    this.setState({height: value});
                }
            }
        } else if (!event.target.value) {
            // figure out whether we should update the width or height
            let value = "";
            if (event.target === this.refs.width) {
                this.setState({width: value});
            } else if (event.target === this.refs.height) {
                this.setState({height: value});
            }
        }
    }

    /**
     * Handle a blur event on the form inputs.
     *
     * @param event
     */
    onBlur(event) {
        // make sure the value is within our min and max
        let value = parseInt(event.target.value < this.props.min ?
            this.props.min :
            (event.target.value > this.props.max ?
                this.props.max : event.target.value)
        );

        // figure out whether we should update the width or height
        if (event.target === this.refs.width) {
            this.setState({width: value});
        } else if (event.target === this.refs.height) {
            this.setState({height: value});
        }
    }

    /**
     * Determine whether a value is an integer.
     *
     * @param value the value
     * @returns {boolean} is the value an int?
     */
    isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        let val = parseInt(value);
        return (val | 0) === val;
    }


    /**
     * Render the AppCreating component.
     *
     * @returns {XML}
     */
    render() {
        return <div className="app-creating-container">
            <div className="app-creating">
            <div className="header">
                <h2>Create a puzzle:</h2>
            </div>
            <div className="form">
                <div className="row">
                    <input className="value" ref="width" value={this.state.width} onChange={this.onChange} onBlur={this.onBlur}/>
                    <span>x</span>
                    <input className="value" ref="height" value={this.state.height} onChange={this.onChange} onBlur={this.onBlur}/>
                </div>
            <button onClick={this.handleClick}>Start creating</button>
            </div>
            </div>
        </div>;
    }
}

AppCreating.propTypes = {
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    onSubmit: React.PropTypes.func.isRequired
}

AppCreating.defaultProps = {
    min: 5,
    max: 25
};

module.exports = AppCreating;