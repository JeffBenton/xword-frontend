/**
 * Created by alex on 11/28/15.
 */

let Clue = require('./clue.js');

class ClueHelper {

    static determineDeletedClues(board, box) {
        var determineDeletedDownClues = function() {
            if (!box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfDownClue(box)) {
                    if (board.above(box) == null || !ClueHelper.isPartOfDownClue(board.above(box)) || !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) {
                        console.log('- deleting clue ' + box.down.clue + ' down');
                        return box.down.clue;
                    }
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfDownClue(board.below(box))) {
                    console.log('- deleting clue ' + board.below(box).down.clue + ' down');
                    return board.below(box).down.clue;
                }
            }
        };
        var determineDeletedAcrossClues = function() {
            if (!box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                        if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box))) &&
                            !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.log('- deleting clue ' + box.across.clue + ' across');
                            return box.across.clue;
                        }
                    } else if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box)))) {
                        console.log('- deleting clue ' + box.across.clue + ' across');
                        return box.across.clue;
                    }
                } else if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                        console.log('- deleting clue ' + box.across.clue + ' across');
                        return box.across.clue;
                    }
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfAcrossClue(board.left(box)) && ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    console.log('- deleting clue ' + board.right(box).across.clue + ' across');
                    return board.right(box).across.clue;
                }
            }
        };

        return {
            down: determineDeletedDownClues(),
            across: determineDeletedAcrossClues()
        };
    }

    static determineCreatedClues(board, box) {
        var determineCreatedDownClues = function() {
            if (box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfDownClue(board.below(box))) {
                    console.log('+ creating clue ' + board.below(box).down.clue + ' down');
                    return board.below(box).down.clue;
                }
            } else {
                // this means we're removing a black box.
                if ((ClueHelper.isPartOfDownClue(board.above(box)) && !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) ||
                    (ClueHelper.isPartOfDownClue(board.below(box))) && !ClueHelper.isPartOfDownClue(board.below(board.below(box)))) {
                    console.log('+ creating clue ' + box.down.clue + ' down');
                    return box.down.clue;
                }
            }
        };
        var determineCreatedAcrossClues = function() {
            if (box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box)) && ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    console.log('+ creating clue ' + board.right(box).across.clue + ' across');
                    return board.right(box).across.clue;
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                        if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box))) &&
                            !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.log('+ creating clue ' + box.across.clue + ' across');
                            return box.across.clue;
                        }
                    } else if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box)))) {
                        console.log('+ creating clue ' + box.across.clue + ' across');
                        return box.across.clue;
                    }
                } else if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                        console.log('+ creating clue ' + box.across.clue + ' across');
                        return box.across.clue;
                    }
                }
            }
        };

        return {
            down: determineCreatedDownClues(),
            across: determineCreatedAcrossClues()
        };
    }

    static updateClues(oldclues, newclues, creates, deletes) {
        var deletedAcrossClue = deletes.across != null ? oldclues.across[deletes.across] : null;
        var deletedDownClue = deletes.down != null ? oldclues.down[deletes.down] : null;

        // todo: this is wrong, we need to delete at the same time
        if (deletes.across && deletes.down && deletes.across < deletes.down) {
            oldclues = ClueHelper.deleteClue('down', deletes.down, oldclues);
            oldclues = ClueHelper.deleteClue('across', deletes.across, oldclues);
        } else {
            oldclues = ClueHelper.deleteClue('across', deletes.across, oldclues);
            oldclues = ClueHelper.deleteClue('down', deletes.down, oldclues);
        }

        var createdDownClue = null;
        if (creates.down != null) {
            createdDownClue = new Clue('down', creates.down);
            if (deletedDownClue != null) {
                createdDownClue.text = deletedDownClue.text;
            }
        }
        var createdAcrossClue = creates.across != null ? new Clue('across', creates.across) : null;

        // todo: this is wrong, we need to create at the same time
        if (createdDownClue != null && createdAcrossClue != null && createdDownClue.number < createdAcrossClue.number) {
            if (createdDownClue != null) {
                oldclues = ClueHelper.createClue(createdDownClue, oldclues);
            }
            if (createdAcrossClue != null) {
                oldclues = ClueHelper.createClue(createdAcrossClue, oldclues);
            }
        } else {
            if (createdAcrossClue != null) {
                oldclues = ClueHelper.createClue(createdAcrossClue, oldclues);
            }
            if (createdDownClue != null) {
                oldclues = ClueHelper.createClue(createdDownClue, oldclues);
            }
        }

        console.log(oldclues);
        return oldclues;
    }

    static deleteClue(key, number, clues) {
        if (key == null || number == null) {
            return clues;
        }
        var result = {};
        var deleted = (function() {
            let count = 0;
            for (let dir in clues) {
                if (clues.hasOwnProperty(dir) && clues[dir].hasOwnProperty(number)) {
                    count++;
                }
            }
            return count <= 1;
        })();

        if (clues[key][number] != null) {
            for (let direction in clues) {
                if (clues.hasOwnProperty(direction)) {
                    result[direction] = {};
                    for (let num in clues[direction]) {
                        if (clues[direction].hasOwnProperty(num)) {
                            if (!(key == direction && number == num)) {
                                if (num > number && deleted) {
                                    clues[direction][num].number = num - 1;
                                    result[direction][num - 1] = clues[direction][num];
                                } else {
                                    result[direction][num] = clues[direction][num];
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    static createClue(clue, clues) {
        var result = {};
        var created = (function() {
            let count = 0;
            for (let dir in clues) {
                if (dir != clue.direction && clues.hasOwnProperty(dir) && clues[dir].hasOwnProperty(clue.number)) {
                    count++;
                }
            }
            return count == 0;
        })();

        for (let direction in clues) {
            if (clues.hasOwnProperty(direction)) {
                result[direction] = {};
                for (let num in clues[direction]) {
                    if (clues[direction].hasOwnProperty(num)) {
                        if (num >= clue.number) {
                            clues[direction][num].number = parseInt(num) + 1;
                            result[direction][parseInt(num) + 1] = clues[direction][num];
                        } else {
                            result[direction][num] = clues[direction][num];
                        }
                    }
                }
            }
        }

        result[clue.direction][clue.number] = clue;

        return result;
    }

    static isPartOfDownClue(box) {
        return box != null && box.isPartOfDownClue();
    }

    static isPartOfAcrossClue(box) {
        return box != null && box.isPartOfAcrossClue();
    }
}

module.exports = ClueHelper;