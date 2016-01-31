/**
 *
 * @author alex
 */

import React from 'react';
import DynamicForm from './../Form/DynamicForm.js';
import CrosswordMetadata from './CrosswordMetadata.js';
class EditableCrosswordMetadata extends CrosswordMetadata {

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
            },
            {
                name: "difficulty",
                title: "Difficulty",
                type: "rating",
                onUpdate: this.props.onUpdate
            },
            {
                name: "description",
                title: "Description",
                type: "textarea",
                onUpdate: this.props.onUpdate
            }
        ];
    }
}

EditableCrosswordMetadata.propTypes = {
    data: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired
};

module.exports = EditableCrosswordMetadata;