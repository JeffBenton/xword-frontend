/**
 * Created by alex on 11/28/15.
 */

class ClueHelper {

    static determineDeletedClues(board, box) {
        var determineDeletedDownClues = function() {
            if (!box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfDownClue(box)) {
                    if (board.above(box) == null || !ClueHelper.isPartOfDownClue(board.above(board.above(box)))) {
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
                    ClueHelper.isPartOfDownClue(board.below(box))) {
                    console.log('+ creating clue ' + box.down.clue + ' down');
                    return box.down.clue;
                }
            }
        };
        var determineCreatedAcrossClues = function() {
            if (box.isBlackBox) {
                // this means we're creating a black box.
                if (ClueHelper.isPartOfAcrossClue(board.right(box))) {
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

    static deleteClue(key, number, clues) {
        
        return clues;
    }

    static addClue(clue, key, number, clues) {

        return clues;
    }

    static isPartOfDownClue(box) {
        return box != null && box.isPartOfDownClue();
    }

    static isPartOfAcrossClue(box) {
        return box != null && box.isPartOfAcrossClue();
    }
}

module.exports = ClueHelper;