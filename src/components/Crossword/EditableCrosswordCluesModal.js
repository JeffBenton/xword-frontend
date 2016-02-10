import React from 'react';
import Modal from '../Modal/Modal.js';
import './EditableCrosswordCluesModal.css';

class EditableCrosswordCluesModal extends Modal {

    constructor(props) {
        super(props);
        console.log(props);
        this.submitClues = this.submitClues.bind(this);
        this.state.value = this.cluesToValue(props.clues);
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: this.cluesToValue(props.clues)
        });
    }

    componentDidMount() {
        this.refs.textarea.focus();
        let val = this.refs.textarea.value;
        this.refs.textarea.value = "";
        this.refs.textarea.value = val;
    }

    cluesToValue(clues) {
        var value = "";
        if (clues) {
            Object.keys(clues).forEach((key, i, list) => {
                value += (key + " " + clues[key].text);
                if (i < list.length - 1) {
                    value += "\n";
                }
            });
        }
        return value;
    }

    valueToClues(value) {
        if (value) {
            let clues = {};
            let val = value.split("\n");
            let i = 0;
            let currentClue;
            while (i < val.length) {
                let line = val[i].split(" ");
                if (line[0] && this.props.clues[line[0]]) {
                    if (currentClue) {
                        clues[currentClue.number] = currentClue.text.trim();
                    }
                    currentClue = {
                        number: line[0],
                        text: line.map((key, i) =>
                            {
                                if (i > 0) {
                                    return line[i].trim();
                                }
                            }).join(" ")
                    };
                } else if (currentClue) {
                    currentClue.text += " " + val[i].trim();
                } else {
                    console.error("dunno what to do with line: " + val[i]);
                }
                i++;
            }
            if (currentClue) {
                clues[currentClue.number] = currentClue.text.trim();
            }
            return clues;
        }
        return null;
    }

    submitClues() {
        if (this.props.submit) {
            this.props.submit(this.valueToClues(this.refs.textarea.value));
        }
    }

    getHeaderContent() {
        return <span>{this.props.direction}</span>
    }

    getBodyContent() {
        return <textarea ref="textarea" defaultValue={this.state.value}/>;
    }

    getFooterContent() {
        return <button onClick={this.submitClues}/>;
    }

    render() {
        return <div className="editable-clues-modal">{super.render()}</div>;
    }
}

module.exports = EditableCrosswordCluesModal;