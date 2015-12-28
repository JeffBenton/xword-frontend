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
        }
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