/**
 * Created by alex on 12/4/15.
 */

import React from 'react';

class CrosswordHeaderDivider extends React.Component {

    getDividerStyle() {
        return {
            width: "20px",
            fontSize: "24px",
            display: "inline-block",
            textAlign: "center",
            verticalAlign: "top"
        }
    }

    render() {
        return (<div style={this.getDividerStyle()}>|</div>);
    }
}

module.exports = CrosswordHeaderDivider;