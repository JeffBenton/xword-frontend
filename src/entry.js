import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App/App.js';

const root = document.getElementById('root');
const app = {};

/**
 *
 */
function run() {
    console.log(window.location.pathname);

    // create the app
    ReactDOM.render(React.createElement(App), root);
}

// run the app when the page loads
window.addEventListener('DOMContentLoaded', run);
