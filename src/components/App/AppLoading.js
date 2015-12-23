import React from 'react';
import './AppLoading.css';

class AppLoading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isTooLong: false
        }
        this.onTimerExpire = this.onTimerExpire.bind(this);
    }

    onTimerExpire() {
        this.setState({
            isTooLong: true
        });
    }

    componentDidMount() {
        this.timer = setTimeout(this.onTimerExpire, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (<div className='AppLoading-frame'>
            <div className='AppLoading-animation-class' style={{transform: 'scale(0.59)'}}>
                <div><div></div></div>
                <div><div></div></div>
                <div><div></div></div>
                <div><div></div></div>
                <div><div></div></div>
                <div><div></div></div>
                <div><div></div></div>
                <div><div></div></div>
            </div>
            {this.state.isTooLong ? "waking up heroku..." : "loading..."}
        </div>);
    }
}

module.exports = AppLoading;