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
        this.onBlur = this.onBlur.bind(this);
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
            let value = parseInt(event.target.value);
            if (value < 100 && value >= 0) {
                if (event.target === this.refs.width) {
                    this.setState({width: value});
                } else if (event.target === this.refs.height) {
                    this.setState({height: value});
                }
            }
        } else if (!event.target.value) {
            let value = "";
            if (event.target === this.refs.width) {
                this.setState({width: value});
            } else if (event.target === this.refs.height) {
                this.setState({height: value});
            }
        }
    }

    onBlur(event) {
        let value = parseInt(event.target.value < this.props.min ?
            this.props.min :
            (event.target.value > this.props.max ?
                this.props.max : event.target.value)
        );
        if (event.target === this.refs.width) {
            this.setState({width: value});
        } else if (event.target === this.refs.height) {
            this.setState({height: value});
        }
    }

    isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        let val = parseInt(value);
        return (val | 0) === val;
    }


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

AppCreating.defaultProps = {
    min: 5,
    max: 25
};

module.exports = AppCreating;