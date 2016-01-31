import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App/App.js';
import AppEdit from './components/App/AppEdit.js';
import AppCreate from './components/App/AppCreate.js';
import AppSolve from './components/App/AppSolve.js';

import EditableCrosswordController from './components/Crossword/EditableCrosswordController.js';
import { Router, Route, Link } from 'react-router';
import history from './history.js';

const root = document.getElementById('root');
const app = {};

/**
 *
 */
function run() {
    // create the app
    ReactDOM.render((
        <Router history={history}>
            <Route path="/edit/:id" component={AppEdit}/>
            <Route path="/create" component={AppCreate}/>
            <Route path="/solve/:id" component={AppSolve}/>
            <Route path="/" component={App}/>
        </Router>), root);
}

// run the app when the page loads
window.addEventListener('DOMContentLoaded', run);
