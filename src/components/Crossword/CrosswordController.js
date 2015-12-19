/**
 * Created by alex on 12/13/15.
 */
import React from 'react';
import Crossword from './Crossword.js';

class CrosswordController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.params ? props.params.id : null
        }
    }

    render() {
        return (<Crossword game={this.props.game} />);
    }
}

module.exports = CrosswordController;
