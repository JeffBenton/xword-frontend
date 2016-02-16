import React from 'react';

/**
 * Container for the landing page of the application.
 *
 * props:
 *      children - list of AppOptions - the AppOptions to display in this container
 */
class AppLanding extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Render the AppLanding component.
     * @returns {XML}
     */
    render() {
        return (
        <div>
            <div style={{display:"block", width:"100%", paddingTop:"10%"}}></div>
            {this.props.children}
        </div>)
    }
}

module.exports = AppLanding;