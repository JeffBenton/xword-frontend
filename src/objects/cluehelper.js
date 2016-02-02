import Clue from './clue.js';

/**
 * Contains game logic around adding and deleting clues from a crossword board based on user input.
 */
class ClueHelper {

    /**
     * Helper method to find the first box in a clue and turn it into a clue result object,
     * for use in creating or deleting clues.
     *
     * We need to find the first box in a clue so that we know if we're completely deleting
     * or creating a clue number. This is important so we can keep our existing clue text data
     * and adjust each clue's number when we add or remove boxes from a board.
     *
     * @param box
     *      the box to start at
     * @param direction
     *      the direction (across|down)
     * @param board
     *      the board
     * @returns {*}
     *      a clue result object
     * @private
     */
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

    /**
     * Determine the deleted clues from a provided board.
     *
     * @param board
     *      the board, before the box is changed
     * @param box
     *      the box that is changing state
     *
     * @returns {{down, across}}
     *      the clues that will be deleted as a result of this change
     */
    static determineDeletedClues(board, box) {

        /**
         * Determine the down clue that will be deleted, if any.
         *
         * @returns {*} a clue result object indicating the clue that will be deleted, or null
         */
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

        /**
         * Determine the across clue that will be deleted, if any.
         *
         * @returns {*} a clue result object indicating the clue that will be deleted, or null
         */
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

    /**
     * Determine the clues that were created from a provided board.
     *
     * @param board
     *      the board, after the box is changed
     * @param box
     *      the box that is changing state
     *
     * @returns {{down, across}}
     *      the clues that will be deleted as a result of this change
     */
    static determineCreatedClues(board, box) {

        /**
         * Determine the down clue that will be created, if any.
         *
         * @returns {*} a clue result object indicating the clue that will be created, or null
         */
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

        /**
         * Determine the across clue that will be created, if any.
         *
         * @returns {*} a clue result object indicating the clue that will be created, or null
         */
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

    /**
     * Update the clue object based on the board state.
     *
     * @param oldclues
     *      the old clues
     * @param newclues
     *      the new clues
     * @param creates
     *      the created clues
     * @param deletes
     *      the deleted clues
     * @param board
     *      the game board
     * @returns {*}
     *      the clues to use
     */
    static updateClues(oldclues, newclues, creates, deletes, board) {

        // get references to the deleted clues, if any.
        var deletedAcrossClue = deletes.across != null ? oldclues.across[deletes.across.clue] : null;
        var deletedDownClue = deletes.down != null ? oldclues.down[deletes.down.clue] : null;

        // because we're only changing one box at a time, we can only have max 2 deleted clues and 2 created clues.
        var createdDownClue = null;
        var createdAcrossClue = null;

        // if we need to create a down clue, create it.
        if (creates.down != null) {
            createdDownClue = new Clue(creates.down.direction, creates.down.clue);

            // if we deleted a down clue, this created clue should have the same clue text.
            // the result is that we essentially moved an existing down clue up or down.
            if (deletedDownClue != null) {
                createdDownClue.text = deletedDownClue.text;
            }
        }

        // if we need to create an across clue, create it.
        if (creates.across != null) {
            createdAcrossClue = new Clue(creates.across.direction, creates.across.clue);

            // if we deleted an across clue, this created clue should have the same clue text.
            // the result is that we essentially moved an existing across clue left or right.
            if (deletedAcrossClue != null) {
                createdAcrossClue.text = deletedAcrossClue.text;
            }
        }

        var createdClues = {
            across: createdAcrossClue,
            down: createdDownClue
        };


        // create and fill an array of 'work' to do.
        // the work array helps sequence the creates and deletes correctly.
        var work = [];

        Object.keys(creates).forEach((key) => {
            if (creates[key] != null) {
                if (work[creates[key].clue] == null) {
                    work[creates[key].clue] = {creates: [], deletes: []};
                }
                work[creates[key].clue].creates.push({key: key, flag: creates[key].flag});
            }
        });

        Object.keys(deletes).forEach((key) => {
            if (deletes[key] != null) {
                if (work[deletes[key].clue] == null) {
                    work[deletes[key].clue] = {creates: [], deletes: []};
                }
                work[deletes[key].clue].deletes.push({key: key, flag: deletes[key].flag});
            }
        });

        // go through the work array and create or delete clues based on the work to do.
        // because the clue numbers will change based on these actions, maintain the 'deleteOffset'
        // to make sure our numbers are correct.
        let deleteOffset = 0;
        for (let i = 0; i <= work.length; i++) {
            if (work[i] != null) {

                // delete a clue
                if (work[i].deletes.length > 0) {

                    // edge case: if we're deleting two clues with the same number (ex: 4 down and 4 across),
                    // we should only decrement numbers once.
                    if (work[i].deletes.length == 2) {
                        work[i].deletes[1].flag = false;
                    }

                    for (let j = 0; j < work[i].deletes.length; j++) {
                        oldclues = ClueHelper.deleteClue(work[i].deletes[j], i + deleteOffset, oldclues);
                        if (!work[i].deletes[j].flag) {
                            deleteOffset--;
                        }
                    }
                }

                // create a clue
                if (work[i].creates.length > 0) {

                    // edge case: if we're creating two clues with the same number (ex: 4 down and 4 across),
                    // we should only increment numbers once.
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
            // verify we did everything correctly. if we did, return the clues!
            ClueHelper.verifyClues(oldclues, newclues);
            return oldclues;
        } catch (e) {
            // ...if not, we lost all the clue data. oops .__.
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

    /**
     * Delete a clue from the clues list.
     *
     * @param del
     *      a clue result object indicating which clue to delete
     * @param number
     *      the clue number to delete
     * @param clues
     *      the clues object
     * @returns {*} the new clues object, with the provided clue deleted and clue numbers adjusted
     */
    static deleteClue(del, number, clues) {
        if (del == null || number == null) {
            return clues;
        }

        var key = del.key;
        var result = {};

        // are we completely deleting this clue number?
        var deleted = !del.flag;

        if (clues[key][number] == null) {
            console.error("tried to delete a clue that doesn't exist");
            return clues;
        }

        Object.keys(clues).forEach((direction) => {
            result[direction] = {};

            // for each clue, evaluate whether we need to decrement the clue number
            // and add it to the result map
            Object.keys(clues[direction]).forEach((num) => {

                // don't include the deleted clue in the result
                if (!(key == direction && number == num)) {

                    // we need to decrement the clue numbers for clues with numbers greater
                    // than or equal to the deleted clue. but we only need to decrement clue
                    // numbers if we actually completely deleted the number from the board!
                    if (num > number && deleted) {
                        clues[direction][num].number = num - 1;
                        result[direction][num - 1] = clues[direction][num];
                    } else {
                        result[direction][num] = clues[direction][num];
                    }
                }
            });
        });

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

            // for each clue, evaluate whether we need to adjust the number
            // and add it to the result map
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