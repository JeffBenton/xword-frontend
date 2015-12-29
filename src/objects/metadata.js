/**
 *
 * @author alex
 */

class Metadata {

    static fromSavedMetadata(metadata) {
        var object = new Metadata();
        if (metadata) {
            object.title = metadata.title;
            object.difficulty = metadata.difficulty;
            object.author = metadata.author;
            object.editor = metadata.editor;
            object.source = metadata.source;
            object.description = metadata.description;
        }
        return object;
    }

    constructor() {
        this.title = null;
        this.difficulty = null;
        this.author = null;
        this.editor = null;
        this.source = null;
        this.description = null;
    }
}

module.exports = Metadata;