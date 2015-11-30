/**
 * Created by alex on 11/28/15.
 */

class ClueHelper {

    static determineNewClueNumber(board, x, y) {
        let box = board.get(x, y);
        if (box.across != null && box.across.char == 0) {
            return box.across.clue;
        }
        if (box.down != null && box.down.char == 0) {
            return box.down.clue;
        }
        for (let i = 1; x + i < board.width || x - i >= 0; i++) {
            if (x + i < board.width) {
                let b = board.get(x+i, y);
                if (b.across != null && b.across.char == 0) {
                    return b.across.clue;
                }
                if (b.down != null && b.down.char == 0) {
                    return b.down.clue;
                }
            }
            if (x - i >= 0) {
                let b = board.get(x-i, y);
                if (b.down != null && b.down.char == 0) {
                    return b.down.clue + 1;
                }
                if (b.across != null && b.across.char == 0) {
                    return b.across.clue + 1;
                }
            }
        }
        
        if (y == 0) {
            return 1;
        } else {
            return ClueHelper.determineNewClueNumber(board, board.width, y-1);
        }
    }
}

module.exports = ClueHelper;