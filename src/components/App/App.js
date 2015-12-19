import React from 'react';

import AppOption from './AppOption.js';
import AppLanding from './AppLanding.js';
import Crossword from './../Crossword/Crossword.js';
import Game from './../../objects/game.js';
import {API_URL} from './../../objects/constants.js';
import history from './../../history.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {mode: null};
    }

    getAppOptions() {
        return [
            {
                title: "create",
                onClick: (function(context) {
                    return function() {
                        console.log("clicked create");
                        history.pushState(null, "/create");
                    };
                })(this)
            },
            {
                title: "edit",
                onClick: (function(context) {
                    return function() {
                        console.log("clicked edit");
                    }
                })(this)
            }
        ];
    }

    render() {
        return (<div><AppLanding>{this.getAppOptions().map(function (option, i) {
            return (<AppOption onClick={option.onClick} title={option.title} key={i}/>);
        })}</AppLanding></div>);
    }

}


module.exports = App;