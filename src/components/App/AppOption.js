import React from 'react';
import './AppOption.css';

/**
 * An option for the main App screen.
 *
 * props:
 *      title - string - the option title to be displayed
 *      icon - string - the icon name
 *      onClick - function - callback function for when the option is clicked
 */
class AppOption extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-option" onClick={this.props.onClick}>
                <div className="frame">
                    <i className="material-icons">{this.props.icon}</i>
                    <div className="title">
                        {this.props.title}
                    </div>
                </div>
            </div>)
    }
}

AppOption.propTypes = {
    onClick: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired
};

module.exports = AppOption;