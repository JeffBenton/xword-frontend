/**
 *
 * @author alex
 */

import React from 'react';

class AppLanding extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>{this.props.children}</div>)
    }
}

module.exports = AppLanding;