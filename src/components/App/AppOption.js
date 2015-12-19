/**
 *
 * @author alex
 */

import React from 'react';

class AppOption extends React.Component {

    getAppOptionStyle() {
        return {}
    }

    render() {
        return (<div style={this.getAppOptionStyle()} onClick={this.props.onClick}>{this.props.title}</div>)
    }
}

AppOption.propTypes = {
    onClick: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired
};

AppOption.defaultProps = {

};

module.exports = AppOption;