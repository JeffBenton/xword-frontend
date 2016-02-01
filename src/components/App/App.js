import React from 'react';

import AppOption from './AppOption.js';
import AppLanding from './AppLanding.js';
import Crossword from './../Crossword/Crossword.js';
import Game from './../../objects/game.js';
import {API_URL} from './../../util/constants.js';
import history from './../../history.js';
import {canUseLocalStorage, hasSolveState, hasEditState} from './../../util/localstoragehelper.js';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {mode: null};
    }

    getAppOptions() {
        let options = [
            {
                title: "Create a new crossword puzzle",
                onClick: (function(context) {
                    return function() {
                        console.log("clicked create");
                        history.pushState(null, "/create");
                    };
                })(this),
                icon: "add"
            }
        ];
        if (canUseLocalStorage()) {
            let editItem = hasEditState();
            if (editItem) {
                options.push({
                    title: "Continue editing your last puzzle",
                    onClick: (function(context) {
                        return function() {
                            history.pushState(null, "/edit");
                        };
                    })(this),
                    icon: "border_all"
                });
            }
            let solveItem = hasSolveState();
            if (solveItem) {
                options.push({
                    title: "Continue solving your last puzzle",
                    onClick: (function(context) {
                        return function() {
                            history.pushState(null, "/solve");
                        };
                    })(this),
                    icon: "edit"
                });
            }
        }
        return options;
    }

    render() {
        return (<div><AppLanding>{this.getAppOptions().map(function (option, i) {
            return (<AppOption key={i} {...option}/>);
        })}</AppLanding></div>);
    }

}


module.exports = App;