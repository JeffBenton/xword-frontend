import React from 'react';
import './AppError.css';
/**
 * A component that displays an error message.
 */
class AppError extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="app-error">{this.props.error}</div>;
    }
}

module.exports = AppError;