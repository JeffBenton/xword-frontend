import {boxState} from './../util/constants.js';

class Box {

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

    isBlackBox() {
        return this.state === boxState.BLACKBOX;
    }

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

    clearValue() {
        this.value = null;
        this.color = "000000";
    }

    markValid() {
        this.color = "519E44";
    }

    markInvalid() {
        this.color = "9C1414";
    }

    set(value) {
        this.value = value;
        this.color = "000000";
    }

    isSelected() {
        return this.state === boxState.SELECTED || this.state === boxState.FOCUSED || this.state === boxState.ACTIVE;
    }

    isPartOfAcrossClue() {
        return !this.isBlackBox() && this.across !== null;
    }

    isPartOfDownClue() {
        return !this.isBlackBox() && this.down !== null;
    }
}

module.exports = Box;