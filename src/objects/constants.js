/**
 * Created by alex on 12/2/15.
 */

module.exports = {
    directions: ['across','down'],
    clueState: {
        NORMAL: 'NORMAL',
        SELECTED: 'SELECTED',
        FOCUSED: 'FOCUSED'
    },
    boxState: {
        BLACKBOX: 'BLACKBOX',
        NORMAL: 'NORMAL',
        SELECTED: 'SELECTED',
        FOCUSED: 'FOCUSED',
        ACTIVE: 'ACTIVE'
    },

    otherDirection: function(direction) {
        if (direction === 'across') {
            return 'down';
        } else if (direction === 'down') {
            return 'across';
        } else {
            return null;
        }
    },

    toLetter(code) {
        if ((code === 32) || (code > 64 && code < 91) || (code > 96 && code < 123)) {
            return String.fromCharCode(code).toUpperCase();
        }
    },

    realWidth(element) {
        if (element) {
            let width = window.getComputedStyle(element)['width'];
            return parseInt(width.substring(0, width.indexOf('px')));
        } else {
            return 0;
        }
    },

    API_URL: "https://xword-backend.herokuapp.com/"
};