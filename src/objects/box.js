import {boxState} from './../util/constants.js';

/**
 * Object representing a crossword puzzle box. Keeps track of the box state and
 * provides some useful methods to abstract away some state changes.
 */
class Box {

    /**
     * Construct a new box with no value.
     *
     * @param id
     *      a unique id
     * @param version
     *      the version
     * @param x
     *      the x position on the board
     * @param y
     *      the y position on the board
     */
    constructor(id, version, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.value = null;
        this.state = boxState.NORMAL;
        this.across = null;
        this.down = null;
        this.version = version;
        this.color = "000000";
    }

    /**
     * Is this box a black box?
     *
     * @returns {boolean}
     */
    isBlackBox() {
        return this.state === boxState.BLACKBOX;
    }

    /**
     * Toggle this box between NORMAL and BLACKBOX states.
     */
    toggleBlackBoxState() {
        if (this.isBlackBox()) {
            this.state = boxState.NORMAL;
        } else {
            this.state = boxState.BLACKBOX;
            this.value = null;
            this.across = null;
            this.down = null;
            this.color = "000000";
        }
    }

    /**
     * Clear the value associated with this box.
     */
    clearValue() {
        this.value = null;
        this.color = "000000";
    }

    /**
     * Mark the value in this box as valid!
     */
    markValid() {
        this.color = "519E44";
    }

    /**
     * Mark the value in this box as invalid .__.
     */
    markInvalid() {
        this.color = "9C1414";
    }

    /**
     * Set the value in this box to the provided value.
     *
     * @param value
     */
    set(value) {
        this.value = value;
        this.color = "000000";
    }

    /**
     * Get the value of this box. Returns an empty string if the box is empty.
     *
     * @returns {*}
     */
    get() {
        if (this.value) {
            return this.value;
        }
        return '';
    }

    /**
     * Is this box selected?
     *
     * @returns {boolean}
     */
    isSelected() {
        return this.state === boxState.SELECTED || this.state === boxState.FOCUSED || this.state === boxState.ACTIVE;
    }

    /**
     * Is this box part of an across clue?
     *
     * @returns {boolean}
     */
    isPartOfAcrossClue() {
        return !this.isBlackBox() && this.across !== null;
    }

    /**
     * Is this box part of a down clue?
     *
     * @returns {boolean}
     */
    isPartOfDownClue() {
        return !this.isBlackBox() && this.down !== null;
    }
}

module.exports = Box;