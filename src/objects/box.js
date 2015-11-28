
class Box {

    constructor(id, version, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.value = null;
        this.isBlackBox = false;
        this.isSelected = false;
        this.version = version;
        this.across = null;
        this.down = null;
    }
}

module.exports = Box;