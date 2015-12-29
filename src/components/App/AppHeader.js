import React from 'react';
import './AppHeader.css';
import history from './../../history.js';

class AppHeader extends React.Component {

    constructor(props) {
        super(props);
        this.onHomeClick = this.onHomeClick.bind(this);
    }

    onHomeClick() {
        history.pushState(null, "/");
    }

    render() {
        return (<div className="app-header">
            <a onClick={this.onHomeClick}><i className="material-icons">grid_on</i><span>Home</span></a>
        </div>)
    }
}

module.exports = AppHeader;