import React from 'react';
import './AppHeader.css';
import history from './../../history.js';

/**
 * A simple header with a home button.
 */
class AppHeader extends React.Component {

    constructor(props) {
        super(props);
        this.onHomeClick = this.onHomeClick.bind(this);
    }

    /**
     * Handle clicking on the home button.
     */
    onHomeClick() {
        history.pushState(null, "/");
    }

    /**
     * Render the AppHeader.
     *
     * @returns {XML}
     */
    render() {
        return (<div className="app-header">
            <a onClick={this.onHomeClick}><i className="material-icons">grid_on</i><span>Home</span></a>
        </div>)
    }
}

module.exports = AppHeader;