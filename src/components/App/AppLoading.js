import React from 'react';
import './AppLoading.css';

/**
 * A loading screen.
 *
 * Has a neat CSS animation.
 */
class AppLoading extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "loading..."
        }
        this.onTimerExpire = this.onTimerExpire.bind(this);
    }

    /**
     * Show a different message after a certain amount of time.
     */
    onTimerExpire() {
        this.setState({
            message: "waking up heroku..."
        });
    }

    /**
     * Set a timer to change the loading screen message after a certain amount of time.
     */
    componentDidMount() {
        this.timer = setTimeout(this.onTimerExpire, 5000);
    }

    /**
     * Clear the timer if this component unmounts.
     */
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    /**
     * Render the AppLoading element.
     *
     * @returns {XML}
     */
    render() {
        return (
            <div className='app-loading-container'>
                <div className='app-loading-frame'>
                    <div className='app-loading-animation-class' style={{transform: 'scale(0.75)'}}>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div><div></div></div>
                        <div id='center'></div>
                    </div>
                {this.state.message}
            </div>
        </div>);
    }
}

module.exports = AppLoading;