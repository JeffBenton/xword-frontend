let React = require('react');

class CrosswordBox extends React.Component {

    constructor(props) {
        super(props);
    }

    getBoxStyle() {
        return {
            height: '30px',
            width: '30px',
            border: '1px black solid'
        };
    }

    getNumberStyle() {
        return {
            fontSize: '9px',
            padding: '1px',
            position: 'fixed'
        };
    }

    getValueStyle() {
        return {

        };
    }

    render() {
        var boxStyle = this.getBoxStyle();
        var numberStyle = this.getNumberStyle();
        var valueStyle = this.getValueStyle();
        var onClick = (function(that) {
            return function() {that.props.onClick(that.props.box)};
        })(this);
        var clueNumber = null;
        var value = this.props.box.value != null ? (
            <div style={valueStyle}>
                {this.props.box.value}
            </div>
        ) : null;

        if (this.props.box.isBlackBox) {
            boxStyle.backgroundColor = 'black';
        } else if (this.props.box.across != null && this.props.box.across.char === 0) {
            clueNumber = (
                <div style={numberStyle}>
                    {this.props.box.across.clue}
                </div>);
        } else if (this.props.box.down != null && this.props.box.down.char === 0) {
            clueNumber = (
                <div style={numberStyle}>
                    {this.props.box.down.clue}
                </div>);
        }

        return (<div style={boxStyle} onClick={onClick}>
            {clueNumber}
            {value}
        </div>);
    }
}


CrosswordBox.propTypes = {
    box: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired
};

CrosswordBox.defaultProps = {

};

module.exports = CrosswordBox;