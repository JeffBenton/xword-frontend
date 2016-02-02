import Clue from './clue.js';

/**
 * Contains game logic around adding and deleting clues from a crossword board based on user input.
 */
class ClueHelper {

    static _makeClueResult(box, direction, board) {
        if (box == null) {
            return null;
        }
        switch (direction) {
            case 'down':
                if (box.down.char == 0) {
                    return {clue: box.down.clue, direction: direction, flag: (box.across != null && box.across.char == 0)};
                } else {
                    return ClueHelper._makeClueResult(board.above(box), direction, board);
                }
            case 'across':
                if (box.across.char == 0) {
                    return {clue: box.across.clue, direction: direction, flag: (box.down != null && box.down.char == 0)};
                } else {
                    return ClueHelper._makeClueResult(board.left(box), direction, board);
                }
            default:
                return null;
        }
    }
    static determineDeletedClues(board, box) {
        var determineDeletedDownClues = function() {
            if (!box.isBlackBox()) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfDownClue(box)) {
                    if (board.above(box) == null || !ClueHelper.isPartOfDownClue(board.above(box)) || !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) {
                        console.info('- deleting clue ' + box.down.clue + ' down');
                        return ClueHelper._makeClueResult(box, 'down', board);
                    }
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfDownClue(board.below(box))) {
                    console.info('- deleting clue ' + board.below(box).down.clue + ' down');
                    return ClueHelper._makeClueResult(board.below(box), 'down', board);
                }
            }
            return null;
        };
        var determineDeletedAcrossClues = function() {
            if (!box.isBlackBox()) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                        if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box))) &&
                            !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.info('- deleting clue ' + box.across.clue + ' across');
                            return ClueHelper._makeClueResult(box, 'across', board);
                        } else if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.info('- deleting clue ' + box.across.clue + ' across');
                            return ClueHelper._makeClueResult(box, 'across', board);
                        }
                    } else if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box)))) {
                        console.info('- deleting clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across', board);
                    }
                } else if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                        console.info('- deleting clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across', board);
                    }
                }
                if (ClueHelper.isPartOfAcrossClue(box) && !ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    console.info('- deleting clue ' + box.across.clue + ' across');
                    return ClueHelper._makeClueResult(box, 'across');
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfAcrossClue(board.left(box)) && ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    console.info('- deleting clue ' + board.right(box).across.clue + ' across');
                    return ClueHelper._makeClueResult(board.right(box), 'across', board);
                }
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    console.info('- deleting clue ' + board.right(box).across.clue + ' across');
                    return ClueHelper._makeClueResult(board.right(box), 'across', board);
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
            if (box.isBlackBox()) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfDownClue(board.below(box))) {
                    console.info('+ creating clue ' + board.below(box).down.clue + ' down');
                    return ClueHelper._makeClueResult(board.below(box), 'down', board);
                }
            } else {
                // this means we're removing a black box.
                if ((ClueHelper.isPartOfDownClue(board.above(box)) && !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) ||
                    ((ClueHelper.isPartOfDownClue(board.below(box))) && !ClueHelper.isPartOfDownClue(board.above(box)))) {
                    console.info('+ creating clue ' + box.down.clue + ' down');
                    return ClueHelper._makeClueResult(box, 'down', board);
                }
            }
            return null;
        };
        var determineCreatedAcrossClues = function() {
            if (box.isBlackBox()) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    console.info('+ creating clue ' + board.right(box).across.clue + ' across');
                    return ClueHelper._makeClueResult(board.right(box), 'across', board);
                }
            } else {
                // this means we're removing a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
                    if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                        if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box))) &&
                            !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                            console.info('+ creating clue ' + box.across.clue + ' across');
                            return ClueHelper._makeClueResult(box, 'across', board);
                        }
                    } else if (!ClueHelper.isPartOfAcrossClue(board.right(board.right(box)))) {
                        console.info('+ creating clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across', board);
                    }
                } else if (ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    if (!ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                        console.info('+ creating clue ' + box.across.clue + ' across');
                        return ClueHelper._makeClueResult(box, 'across', board);
                    }
                }
                if (ClueHelper.isPartOfAcrossClue(box) && !ClueHelper.isPartOfAcrossClue(board.left(box))) {
                    console.info('+ creating clue ' + box.across.clue + ' across');
                    return ClueHelper._makeClueResult(box, 'across', board);
                }
                if (ClueHelper.isPartOfAcrossClue(box) && ClueHelper.isPartOfAcrossClue(board.left(box)) && !ClueHelper.isPartOfAcrossClue(board.left(board.left(box)))) {
                    console.info('+ creating clue ' + box.across.clue + ' across');
                    return ClueHelper._makeClueResult(box, 'across', board);
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
        var createdAcrossClue = null;
        if (creates.across != null) {
            createdAcrossClue = new Clue(creates.across.direction, creates.across.clue);
            if (deletedAcrossClue != null) {
                createdAcrossClue.text = deletedAcrossClue.text;
            }
        }
        var createdClues = {
            across: createdAcrossClue,
            down: createdDownClue
        };
        var work = [];

        for (let key in creates) {
            if (creates.hasOwnProperty(key)) {
                if (creates[key] != null) {
                    if (work[creates[key].clue] == null) {
                        work[creates[key].clue] = {creates: [], deletes: []};
                    }
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

        let deleteOffset = 0;
        for (let i = 0; i <= work.length; i++) {
            if (work[i] != null) {
                if (work[i].deletes.length == 2) {
                    work[i].deletes[1].flag = false;
                }
                if (work[i].deletes.length > 0) {
                    for (let j = 0; j < work[i].deletes.length; j++) {
                        oldclues = ClueHelper.deleteClue(work[i].deletes[j], i + deleteOffset, oldclues);
                        if (!work[i].deletes[j].flag) {
                            deleteOffset--;
                        }
                    }
                }
                if (work[i].creates.length > 0) {
                    if (work[i].creates.length == 2) {
                        work[i].creates[0].flag = false;
                    }
                    for (let j = 0; j < work[i].creates.length; j++) {
                        oldclues = ClueHelper.createClue(createdClues[work[i].creates[j].key], oldclues, work[i].creates[j].flag);
                        if (!work[i].creates[j].flag) {
                            deleteOffset++;
                        }
                    }
                }
            }
        }

        try {
            ClueHelper.verifyClues(oldclues, newclues);
            return oldclues;
        } catch (e) {
            console.info('we lost clue data due to this error');
            console.info('the work log was: ');
            console.info(work);
            console.info('the board was: ');
            console.info(board);
            return newclues;
        }
    }

    /**
     * Validate the integrity of the clues.
     *
     * After operating on the oldclues and newclues lists, they should be exactly equals.
     *
     * Throws an error if the two lists do not contain exactly the same clue numbers.
     *
     * @param oldclues
     * @param newclues
     */
    static verifyClues(oldclues, newclues) {

        // make sure that each old clue corresponds to a new clue.
        Object.keys(oldclues).forEach((direction) => {
            if (newclues[direction] == null) {
                console.error('ERROR!! invalid clue state!');
                console.info(oldclues);
                console.info(newclues);
                throw 'ERROR!! invalid clue state!';
            }

            Object.keys(newclues[direction]).forEach((number) => {
                if (newclues[direction][number] == null) {
                    console.error('ERROR!! invalid clue state!');
                    console.info(oldclues);
                    console.info(newclues);
                    throw 'ERROR!! invalid clue state!';
                }
            });
        });

        // make sure that each new clue corresponds to an old clue.
        Object.keys(newclues).forEach((direction) => {
            if (oldclues[direction] == null) {
                console.error('ERROR!! invalid clue state!');
                console.info(oldclues);
                console.info(newclues);
                throw 'ERROR!! invalid clue state!';
            }
            Object.keys(newclues[direction]).forEach((number) => {
                if (oldclues[direction][number] == null) {
                    console.error('ERROR!! invalid clue state!');
                    console.info(oldclues);
                    console.info(newclues);
                    throw 'ERROR!! invalid clue state!';
                }
            });
        });
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

    /**
     * Add a new clue to the provided clues list. Adjust existing clue numbers based on the new addition.
     *
     * @param clue the clue to add
     * @param clues the existing clues list
     * @param flag boolean. if true, do not increment existing clue numbers based on this addition
     *          (ex: if we're adding 1 across, but 1 down already existed, we don't need to adjust numbers)
     * @returns {*} the new clues list, with the new clue added and clue numbers adjusted
     */
    static createClue(clue, clues, flag) {
        if (clue == null) {
            return clues;
        }

        var result = {};

        // are we creating a brand new clue?
        var created = !flag;

        Object.keys(clues).forEach((direction) => {
            result[direction] = {};

            // for each clue, evaluate whether we need to adjust the number and add it to the result map
            Object.keys(clues[direction]).forEach((num) => {

                // we need to increment the number if the previous number is >= the clue we're adding.
                // but we only increment the number if we're actually creating a new clue!
                if (num >= clue.number && created) {
                    clues[direction][num].number = parseInt(num) + 1;
                    result[direction][parseInt(num) + 1] = clues[direction][num];
                } else {
                    result[direction][num] = clues[direction][num];
                }
            });
        });

        // add the new clue to the result map
        result[clue.direction][clue.number] = clue;

        return result;
    }

    /**
     * Is the provided box part of a down clue?
     *
     * @param box
     * @returns {boolean|*}
     */
    static isPartOfDownClue(box) {
        return box != null && box.isPartOfDownClue();
    }

    /**
     * Is the provided box part of an across clue?
     *
     * @param box
     * @returns {boolean|*}
     */
    static isPartOfAcrossClue(box) {
        return box != null && box.isPartOfAcrossClue();
    }
}

module.exports = ClueHelper;