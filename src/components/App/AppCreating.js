/**
 *
 * @author alex
 */

import React from 'react';
import './AppCreating.css';

class AppCreating extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            width: 15,
            height: 15
        };
    }

    handleClick() {
        this.props.onSubmit({height: this.state.height, width: this.state.width});
    }

    onChange(event) {
        if (this.isInt(event.target.value)) {
            let value = parseInt(
                event.target.value < this.props.min ?
                    this.props.min :
                    (event.target.value > this.props.max ?
                        this.props.max : event.target.value));
            if (event.target === this.refs.width) {
                this.setState({width: value});
            } else if (event.target === this.refs.height) {
                this.setState({height: value});
            }
        }
    }

    onBlur(event) {

    }

    isInt(value) {
        try {
            parseInt(value);
            return true;
        } catch (e) {
            return false;
        }
    }


    render() {
        return <div className="app-creating-container">
            <div className="app-creating">
            <div className="header">
                <h2>Create a puzzle:</h2>
            </div>
            <div className="form">
                <div className="row">
                    <input className="value" ref="width" value={this.state.width} min={4} max={25} onChange={this.onChange}/>
                    <span>x</span>
                    <input className="value" ref="height" value={this.state.height} min={4} max={25} onChange={this.onChange}/>
                </div>
            <button onClick={this.handleClick}>Start creating</button>
            </div>
            </div>
        </div>;
    }
}

AppCreating.defaultProps = {
    min: 5,
    max: 25
};

module.exports = AppCreating;