import React from 'react';
import Crossword from './../Crossword/Crossword.js';
import EditableCrossword from './../Crossword/EditableCrossword.js';

class App extends React.Component {

    render() {
        if (this.props.mode == 'CREATE') {
            return (<div><EditableCrossword /></div>);
        } else {
            return (<div><Crossword /></div>);
        }
    }

}

App.propTypes = {
    mode: React.PropTypes.string
};
App.defaultProps = {
    mode: "CREATE"
};


module.exports = App;