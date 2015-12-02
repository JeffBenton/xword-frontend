/**
 * Created by alex on 11/28/15.
 */

import Clue from './clue.js';

class ClueHelper {

    static _makeClueResult(box, direction) {
        if (box == null) {
            return null;
        }
        switch (direction) {
            case 'down':
                return {clue: box.down.clue, direction: direction, flag: (box.across != null && box.across.char == 0)};
            case 'across':
                return {clue: box.across.clue, direction: direction, flag: (box.down != null && box.down.char == 0)};
            default:
                return null;
        }
    }
    static determineDeletedClues(board, box) {
        var determineDeletedDownClues = function() {
            if (!box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfDownClue(box)) {
                    if (board.above(box) == null || !ClueHelper.isPartOfDownClue(board.above(box)) || !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) {
                        console.log('- deleting clue ' + box.down.clue + ' down');
                        return ClueHelper._makeClueResult(box, 'down');
                    }
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfDownClue(board.below(box))) {
                    console.log('- deleting clue ' + board.below(box).down.clue + ' down');
                    return ClueHelper._makeClueResult(board.below(box), 'down');
                }
            }
            return null;
        };
        var determineDeletedAcrossClues = function() {
            if (!box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                        if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box))) &&
                            !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.log('- deleting clue ' + box.across.clue + ' across');
                            return ClueHelper._makeClueResult(box, 'across');
                        }
                    } else if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box)))) {
                        console.log('- deleting clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across');
                    }
                } else if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                        console.log('- deleting clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across');
                    }
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfAcrossClue(board.left(box)) && ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    console.log('- deleting clue ' + board.right(box).across.clue + ' across');
                    return ClueHelper._makeClueResult(board.right(box), 'across');
                }
            }
            return null;
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
                    return ClueHelper._makeClueResult(board.below(box), 'down');
                }
            } else {
                // this means we're removing a black box.
                if ((ClueHelper.isPartOfDownClue(board.above(box)) && !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) ||
                    ((ClueHelper.isPartOfDownClue(board.below(box))) && !ClueHelper.isPartOfDownClue(board.above(box)))) {
                    console.log('+ creating clue ' + box.down.clue + ' down');
                    return ClueHelper._makeClueResult(box, 'down');
                }
            }
            return null;
        };
        var determineCreatedAcrossClues = function() {
            if (box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box)) && ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    console.log('+ creating clue ' + board.right(box).across.clue + ' across');
                    return ClueHelper._makeClueResult(board.right(box), 'across');
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                        if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box))) &&
                            !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.log('+ creating clue ' + box.across.clue + ' across');
                            return ClueHelper._makeClueResult(box, 'across');
                        }
                    } else if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box)))) {
                        console.log('+ creating clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across');
                    }
                } else if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                        console.log('+ creating clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across');
                    }
                }
            }
            return null;
        };

        return {
            down: determineCreatedDownClues(),
            across: determineCreatedAcrossClues()
        };
    }

    static updateClues(oldclues, newclues, creates, deletes, board) {
        var deletedAcrossClue = deletes.across != null ? oldclues.across[deletes.across.clue] : null;
        var deletedDownClue = deletes.down != null ? oldclues.down[deletes.down.clue] : null;
        var createdDownClue = null;

        if (creates.down != null) {
            createdDownClue = new Clue(creates.down.direction, creates.down.clue);
            if (deletedDownClue != null) {
                createdDownClue.text = deletedDownClue.text;
            }
        }
        var createdAcrossClue = creates.across != null ? new Clue(creates.across.direction, creates.across.clue) : null;
        var createdClues = {
            across: createdAcrossClue,
            down: createdDownClue
        };
        var work = [];

        for (let key in creates) {
            if (creates.hasOwnProperty(key)) {
                if (creates[key] != null) {
                    work[creates[key].clue] = {creates: [], deletes: []};
                    work[creates[key].clue].creates.push({key: key, flag: creates[key].flag});
                }
            }
        }

        for (let key in deletes) {
            if (deletes.hasOwnProperty(key)) {
                if (deletes[key] != null) {
                    if (work[deletes[key].clue] == null) {
                        work[deletes[key].clue] = {creates: [], deletes: []};
                    }
                    work[deletes[key].clue].deletes.push({key: key, flag: deletes[key].flag});
                }
            }
        }

        console.log(work);

        let deleteOffset = 0;
        for (let i = 0; i <= work.length; i++) {
            if (work[i] != null) {
                if (work[i].creates.length > 0) {
                    for (let j = 0; j < work[i].creates.length; j++) {
                        oldclues = ClueHelper.createClue(createdClues[work[i].creates[j].key], oldclues, work[i].creates[j].flag);
                        if (!work[i].creates[j].flag) {
                            deleteOffset++;
                        }
                    }
                }
                if (work[i].deletes.length > 0) {
                    for (let j = 0; j < work[i].deletes.length; j++) {
                        oldclues = ClueHelper.deleteClue(work[i].deletes[j], i + deleteOffset, oldclues);
                        deleteOffset--;
                    }
                }
            }
        }

        console.log(oldclues);
        return oldclues;
    }

    static deleteClue(del, number, clues) {
        if (del == null || number == null) {
            return clues;
        }
        var key = del.key;
        var result = {};
        var deleted = !del.flag;
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

    static createClue(clue, clues, flag) {
        if (clue == null) {
            return clues;
        }

        var result = {};
        var created = !flag;
        for (let direction in clues) {
            if (clues.hasOwnProperty(direction)) {
                result[direction] = {};
                for (let num in clues[direction]) {
                    if (clues[direction].hasOwnProperty(num)) {
                        if (num >= clue.number && created) {
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