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
        return (
        <div>
            <div id="hello" style={{display:"block", width:"100%", paddingTop:"10%"}}></div>
            {this.props.children}
        </div>)
    }
}

module.exports = AppLanding;