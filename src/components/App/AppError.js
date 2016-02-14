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
        return  <div>
                    <div className="app-body">
                        <div className="app-error">{this.props.error}</div>
                    </div>
                </div>;
    }
}

module.exports = AppError;