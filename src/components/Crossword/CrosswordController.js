import React from 'react';
import Crossword from './Crossword.js';
import {API_URL} from './../../util/constants.js';
import {setSolveState} from './../../util/localstoragehelper.js';

/**
 * 
 */
class CrosswordController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.params ? props.params.id : null
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        setSolveState({
            game: this.props.game,
            params: this.props.params
        });
    }

    render() {
        return (<Crossword
                    game={this.props.game}
                    metadata={this.props.params ? this.props.params.metadata : null}
                    solver={this.props.solver}
                    onChange={this.handleChange}
        />);
    }
}

module.exports = CrosswordController;
