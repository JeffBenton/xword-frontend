let React = require('react');
let Crossword = require('./../Crossword/Crossword');

class App extends React.Component {

    render() {
        return (<div>
                    <p>this is the main page of the app</p>
                    <p>from here i should be able to create a crossword</p>
                <div><Crossword /></div>
                </div>);
    }

}

module.exports = App;