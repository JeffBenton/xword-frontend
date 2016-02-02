/**
 * Important constants/values.
 */
module.exports = {
    directions: ['across','down'],

    clueState: {
        NORMAL: 'NORMAL', // the clue isn't selected
        SELECTED: 'SELECTED', // the clue is selected, but isn't focused
                              // (the clue perpendicular to the currently FOCUSED clue)
        FOCUSED: 'FOCUSED'  // the clue is focused (accepting user input)
    },
    boxState: {
        BLACKBOX: 'BLACKBOX', // the box is a black square
        NORMAL: 'NORMAL',    // the box is normal
        SELECTED: 'SELECTED', // the box is selected (part of a selected clue)
        FOCUSED: 'FOCUSED', // the box is focused (part of a focused clue)
        ACTIVE: 'ACTIVE' // the box is the current input target
    },

    API_URL: "https://xword-backend.herokuapp.com/"
};