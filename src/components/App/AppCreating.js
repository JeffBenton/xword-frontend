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
    }

    handleClick() {
        this.props.onSubmit({height: parseInt(this.refs.height.value), width: parseInt(this.refs.width.value)});
    }


    render() {
        return <div>
            <h2>How big?</h2>
            <div><span>width</span><input ref="width" type="number" defaultValue={15} value={null} min={4} max={25}/></div>
            <div><span>height</span><input ref="height" type="number" defaultValue={15} value={null} min={4} max={25}/></div>
            <button onClick={this.handleClick}>Start creating</button>
        </div>;
    }
}

module.exports = AppCreating;