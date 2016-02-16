import React from 'react';
import './AppError.css';

/**
 * A component that displays an error message.
 *
 * props:
 *      error - string - the error message
 */
class AppError extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Render the AppError component.
     *
     * @returns {XML}
     */
    render() {
        return  <div>
                    <div className="app-body">
                        <div className="app-error">{this.props.error}</div>
                    </div>
                </div>;
    }
}

AppError.propTypes = {
    error: React.PropTypes.string.isRequired
};

module.exports = AppError;