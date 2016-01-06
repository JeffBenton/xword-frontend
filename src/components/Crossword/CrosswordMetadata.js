/**
 *
 * @author alex
 */

import './CrosswordMetadata.css';
import React from 'react';
import DynamicForm from './../Form/DynamicForm.js';

class CrosswordMetadata extends React.Component {

    getFormSchema() {
        return [
            {
                name: "author",
                title: "Author",
                type: "text"
            },
            {
                name: "editor",
                title: "Editor",
                type: "text"
            },
            {
                name: "source",
                title: "Source",
                type: "text"
            },
            {
                name: "date",
                title: "Date",
                type: "date"
            },
            {
                name: "difficulty",
                title: "Difficulty",
                type: "rating"
            },
            {
                name: "description",
                title: "Description",
                type: "textarea"
            }
        ];
    }

    render() {
        return <div className="crossword-metadata-container">
            <DynamicForm schema={this.getFormSchema()} values={this.props.data}/>
        </div>;
    }
}

CrosswordMetadata.propTypes = {
    data: React.PropTypes.object.isRequired
};

module.exports = CrosswordMetadata;