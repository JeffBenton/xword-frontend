/**
 * Created by alex on 11/28/15.
 */

class ClueHelper {

    static determineNewClueNumber(board, box) {
        for (let i = 1; box.x + i < board.width || box.x - i >= 0; i++) {
            if (box.x + i < board.width) {
                let b = board.get(box.x+i, box.y);
                if (b.across != null && b.across.char == 0) {
                    return b.across.clue;
                }
                if (b.down != null && b.down.char == 0) {
                    return b.down.clue;
                }
            }
            if (box.x - i >= 0) {
                let b = board.get(box.x-i, box.y);
                if (b.down != null && b.down.char == 0) {
                    return b.down.clue + 1;
                }
                if (b.across != null && b.across.char == 0) {
                    return b.across.clue + 1;
                }
            }
        }
    }
}

module.exports = ClueHelper;