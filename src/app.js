let ReactDOM = require('react-dom');
let React = require('react');
let Crossword = require('./components/Crossword/Crossword.js');

const root = document.getElementById('root');
const app = {};

/**
 *
 */
function run() {
    // create a crossword
    ReactDOM.render(React.createElement(Crossword), root);
}

// run the app when the page loads
window.addEventListener('DOMContentLoaded', run);
