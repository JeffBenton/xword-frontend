/**
 *
 * @author alex
 */

import React from 'react';
import DynamicForm from './../Form/DynamicForm.js';
import './EditableCrosswordMetadata.css';

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
            },
            {
                name: "source",
                title: "Source",
                type: "text",
                onUpdate: this.props.onUpdate
            },
            {
                name: "date",
                title: "Date",
                type: "date",
                onUpdate: this.props.onUpdate
            }
        ];
    }

    render() {
        console.log(this.props.data);
        return <div className="editable-crossword-metadata-container">
            <DynamicForm schema={this.getFormSchema()} values={this.props.data} />
        </div>;
    }
}

module.exports = EditableCrosswordMetadata;