import React from 'react';
import AppHeader from './AppHeader.js';
import './AppError.css';

/**
 * A component that displays an error message.
 */
class AppError extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return  <div>
                    <AppHeader />
                    <div className="app-body">
                        <div className="app-error">{this.props.error}</div>
                    </div>
                </div>;
    }
}

module.exports = AppError;