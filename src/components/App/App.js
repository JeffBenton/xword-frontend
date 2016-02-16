import React from 'react';
import AppOption from './AppOption.js';
import AppLanding from './AppLanding.js';
import Crossword from './../Crossword/Crossword.js';
import Game from './../../objects/game.js';
import {API_URL} from './../../util/constants.js';
import history from './../../history.js';
import {canUseLocalStorage, hasSolveState, hasEditState} from './../../util/localstoragehelper.js';
import './App.css';

/**
 * The app landing page. Contains menu options to route to specific app functions.
 */
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {mode: null};
    }

    /**
     * Generate the options on the app landing page.
     *
     * @returns {*[]}
     */
    getAppOptions() {
        let options = [
            {
                title: "Create a new crossword puzzle",
                onClick: () => {
                    history.pushState(null, "/create");
                },
                icon: "add"
            }
        ];

        // only show the localstorage options if we can use localstorage
        if (canUseLocalStorage()) {
            let editItem = hasEditState();
            if (editItem) {
                options.push({
                    title: "Continue editing your last puzzle",
                    onClick: () => {
                        history.pushState(null, "/edit");
                    },
                    icon: "border_all"
                });
            }
            let solveItem = hasSolveState();
            if (solveItem) {
                options.push({
                    title: "Continue solving your last puzzle",
                    onClick: () => {
                        history.pushState(null, "/solve");
                    },
                    icon: "edit"
                });
            }
        }
        return options;
    }

    /**
     * Render the App.
     *
     * @returns {XML}
     */
    render() {
        return  <div>
                    <AppLanding>
                        {this.getAppOptions().map((option, i) => {
                            return (<AppOption key={i} {...option}/>);
                        })}
                    </AppLanding>
                </div>;
    }

}


module.exports = App;