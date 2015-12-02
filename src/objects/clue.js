
class Clue {

    constructor(direction, number) {
        this.direction = direction;
        this.number = number;
        this.text = number + " " + direction;
        this.isSelected = false;
    }
}

module.exports = Clue;