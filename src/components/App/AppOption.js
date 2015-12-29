/**
 *
 * @author alex
 */

import React from 'react';

class AppOption extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isHover: false
        };
        this.handleMouseout = this.handleMouseout.bind(this);
        this.handleMouseover = this.handleMouseover.bind(this);
    }

    handleMouseover() {
        this.setState({
            isHover: true
        });
    }

    handleMouseout() {
        this.setState({
            isHover: false
        });
    }

    getAppOptionStyle() {
        if (!this.state.isHover) {
            return {
                width: "100%",
                cursor: "pointer",
                marginTop: "15px"
            };
        } else {
            return {
                width: "100%",
                cursor: "pointer",
                backgroundColor: "#E3E3E3",
                marginTop: "15px"
            };
        }
    }

    render() {
        return (
            <div style={this.getAppOptionStyle()} onClick={this.props.onClick} onMouseOver={this.handleMouseover} onMouseOut={this.handleMouseout}>
                <div style={
                {marginLeft: "auto",
                 marginRight: "auto",
                 height:"58px",
                 width:"100%",
                 display:"flex",
                 justifyContent:"center",
                 alignItems:"center"}}>
                <i style={{fontSize: "48px"}} className="material-icons">{this.props.icon}</i>
                <div style={
                {marginLeft: "30px",
                 height:"32px",
                 display:"flex",
                 justifyContent:"center",
                 alignItems:"center",
                 fontFamily: "'Raleway', sans-serif"}}>
                {this.props.title}
                </div></div>
            </div>)
    }
}

AppOption.propTypes = {
    onClick: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired
};

AppOption.defaultProps = {

};

module.exports = AppOption;