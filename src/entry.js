let ReactDOM = require('react-dom');
let React = require('react');
let App = require('./components/App/App.js');

const root = document.getElementById('root');
const app = {};

/**
 *
 */
function run() {
    // create the app
    ReactDOM.render(React.createElement(App), root);
}

// run the app when the page loads
window.addEventListener('DOMContentLoaded', run);
