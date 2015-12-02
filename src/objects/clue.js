
class Clue {

    constructor(direction, number) {
        this.direction = direction;
        this.number = number;
        this.text = "";
        this.isSelected = false;
    }
}

module.exports = Clue;