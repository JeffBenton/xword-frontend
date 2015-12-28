/**
 *
 * @author alex
 */

import CrosswordTitle from './CrosswordTitle.js'
import React from 'react';
import './CrosswordTitle.css';
class EditableCrosswordTitle extends CrosswordTitle {

    constructor(props) {
        super(props);

        this.DEFAULT_TITLE = "Untitled Crossword";
        this.state = {
            isEditing: false,
            title: this.props.metadata != null ? this.props.metadata.title : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState({
            isEditing: !this.state.isEditing
        });
    }

    handleBlur() {
        this.setState({
            isEditing: false
        });
    }

    handleChange(event) {
        if (!event.target.value.trim()) {
            event.target.value = null;
            event.target.text = "";
            this.setState({title: null});
        } else {
            event.target.text = event.target.value;
            this.setState({title: event.target.value});
        }
    }

    handleKeydown(event) {
        if (event.which === 13 || event.which === 27) {
            this.setState({isEditing: false});
        }
    }

    componentDidUpdate() {
        if (this.state.isEditing) {
            this.refs.edit.focus();

            // hack to always put the cursor at the end of the value
            let val = this.refs.edit.value;
            this.refs.edit.value = "";
            this.refs.edit.value = val;
        }
    }


    render() {
        if (this.state.isEditing) {
            return (<div className="crossword-title-container">
                <div className="title">
                <input type="text" ref="edit" value={this.state.title} onChange={this.handleChange} onKeyDown={this.handleKeydown} onBlur={this.handleBlur} placeholder={this.DEFAULT_TITLE}/>
                </div>
                <div className="metadata">
                    <span className="field">created by</span><span className="value">Alex</span>
                    <span className="field">edited by</span><span className="value">Alex</span>
                </div>
            </div>);

        } else {
            return (<div className="crossword-title-container">
                <div className="title">
                    <span onClick={this.onClick}>{this.state.title || this.DEFAULT_TITLE}</span>
                </div>
                <div className="metadata">
                    <span className="field">created by</span><span className="value">Alex</span>
                    <span className="field">edited by</span><span className="value">Alex</span>
                </div>
            </div>);
        }
    }
}

module.exports = EditableCrosswordTitle;