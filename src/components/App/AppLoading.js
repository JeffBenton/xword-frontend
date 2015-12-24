import React from 'react';
import './AppLoading.css';

class AppLoading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "loading..."
        }
        this.onTimerExpire = this.onTimerExpire.bind(this);
    }

    onTimerExpire() {
        this.setState({
            message: "waking up heroku..."
        });
    }

    componentDidMount() {
        this.timer = setTimeout(this.onTimerExpire, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <div className='AppLoading-container'>
                <div className='AppLoading-frame'>
                    <div className='AppLoading-animation-class' style={{transform: 'scale(0.75)'}}>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                    </div>
                {this.state.message}
            </div>
        </div>);
    }
}

module.exports = AppLoading;