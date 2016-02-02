/**
 * Dumb object that stores metadata for a crossword puzzle.
 */
class Metadata {

    /**
     * Create a metadata object from a saved object.
     *
     * @param metadata
     *      the saved object
     * @returns {Metadata}
     *      the resulting Metadata object
     */
    static fromSavedMetadata(metadata) {
        var object = new Metadata();
        if (metadata) {
            object.title = metadata.title;
            object.difficulty = metadata.difficulty;
            object.author = metadata.author;
            object.editor = metadata.editor;
            object.source = metadata.source;
            object.description = metadata.description;
            object.date = metadata.date;
        }
        return object;
    }

    /**
     * Construct an empty Metadata object.
     */
    constructor() {
        this.title = null;
        this.difficulty = null;
        this.author = null;
        this.editor = null;
        this.source = null;
        this.description = null;
        this.date = null;
    }
}

module.exports = Metadata;