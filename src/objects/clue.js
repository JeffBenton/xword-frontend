/**
 * Dumb object representing a crossword clue.
 */
class Clue {

    /**
     * Construct a clue with the provided direction and number.
     *
     * Ex: 8 across.
     *
     * @param direction
     * @param number
     */
    constructor(direction, number) {
        this.direction = direction;
        this.number = number;
        this.text = "";
        this.isSelected = false;
    }
}

module.exports = Clue;