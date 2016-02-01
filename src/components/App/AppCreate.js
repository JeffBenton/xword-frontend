import React from 'react';
import EditableCrosswordController from './../Crossword/EditableCrosswordController.js';
import Game from './../../objects/game.js';
import Metadata from './../../objects/metadata.js';
import AppCreating from './AppCreating.js';
import AppHeader from './AppHeader.js';
import {API_URL} from './../../util/constants.js';
import {canUseLocalStorage} from './../../util/localstoragehelper.js';

class AppCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initializeState();
        this.startCreate = this.startCreate.bind(this);
    }

    initializeState() {
        return {
            isLoading: false,
            isCreating: true,
            game: null,
            params: null
        };

    }

    startCreate(params) {
        let width = params.width || this.props.width;
        let height = params.height || this.props.height;
        this.setState({
            isLoading: false,
            isCreating: false,
            game: new Game(width, height),
            params: {
                metadata: new Metadata()
            }
        });
    }

    render() {
        if (this.state.isCreating) {
            return (<div>
                <AppHeader />
                <AppCreating onSubmit={this.startCreate}/></div>)
        } else {
            return (
                <div>
                    <AppHeader />
                    <div className="app-body">
                        <EditableCrosswordController
                            game={this.state.game}
                            params={this.state.params}
                            canUseLocalStorage={canUseLocalStorage()}
                        /></div>
                </div>);
        }
    }
}

AppCreate.defaultProps = {
    width: 15,
    height: 15
};
module.exports = AppCreate;