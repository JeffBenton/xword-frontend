import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App/App.js';
import EditableCrosswordController from './components/Crossword/EditableCrosswordController.js';
import { Router, Route, Link } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

const root = document.getElementById('root');
const app = {};

/**
 *
 */
function run() {
    // create the app
    ReactDOM.render((
        <Router history={createBrowserHistory()}>
            <Route path="/:action/:id" component={App}/>
            <Route path="/" component={App}/>
        </Router>), root);
}

// run the app when the page loads
window.addEventListener('DOMContentLoaded', run);
