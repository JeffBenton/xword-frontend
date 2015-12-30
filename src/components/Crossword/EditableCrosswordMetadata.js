/**
 *
 * @author alex
 */

import React from 'react';
import DynamicForm from './../Form/DynamicForm.js';

class EditableCrosswordMetadata extends React.Component {

    getFormSchema() {
        return [
            {
                name: "author",
                title: "Author",
                type: "text",
                onUpdate: this.props.onUpdate
            },
            {
                name: "editor",
                title: "Editor",
                type: "text",
                onUpdate: this.props.onUpdate
            }];
    }

    render() {
        console.log(this.props);
        return <div className="editable-crossword-metadata-container">
            <span>Puzzle information:</span>
            <DynamicForm schema={this.getFormSchema()} values={this.props.data} />
        </div>;
    }
}

module.exports = EditableCrosswordMetadata;