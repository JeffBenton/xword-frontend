import {directions} from './constants.js';

/**
 * Some helpful utility functions.
 */
module.exports = {

    /**
     * Return the 'other' direction. Expects and returns the direction values located in constants.js.
     *
     * Ex: otherDirection('across') returns 'down'
     *     otherDirection('down') returns 'across'
     *
     * @param direction
     * @returns {*} the other direction, or null if an invalid direction is provided
     */
    otherDirection: function(direction) {
        if (direction === directions[0]) {
            return directions[1];
        } else if (direction === directions[1]) {
            return directions[0];
        } else {
            return null;
        }
    },

    /**
     * Get the letter value from a char code.
     *
     * Returns the uppercase value of the letter, or null if the provided code isn't a letter.
     *
     * @param code
     *      a character code corresponding to a letter
     * @returns {*}
     *      the uppercase value of the letter, or null if the provided code isn't a letter
     */
    toLetter(code) {
        if ((code === 32) || (code > 64 && code < 91) || (code > 96 && code < 123)) {
            return String.fromCharCode(code).toUpperCase();
        }
        return null;
    },

    /**
     * Return the computed width of an element.
     *
     * @param element
     * @returns {*}
     */
    realWidth(element) {
        if (element) {
            let width = window.getComputedStyle(element)['width'];
            return parseInt(width.substring(0, width.indexOf('px')));
        } else {
            return 0;
        }
    },

    /**
     * Utility method to style a textElement such that it fits inside a
     * containerElement with no overflow.
     *
     * Accomplishes this by scaling the font size down until the height
     * of the text element matches the height of the container element.
     *
     * @param textElement
     * @param containerElement
     */
    fitTextToContainer(textElement, containerElement) {
        let realFontSize = function(element) {
            if (element) {
                let fontSize = window.getComputedStyle(element)['fontSize'];
                return parseInt(fontSize.substring(0, fontSize.indexOf('px')));
            } else {
                return 0;
            }
        };
        let realHeight = function(element) {
            if (element) {
                let height = window.getComputedStyle(element)['height'];
                return parseInt(height.substring(0, height.indexOf('px')));
            } else {
                return 0;
            }
        };

        let textHeight = realHeight(textElement);
        let containerHeight = realHeight(containerElement);
        let fontSize = realFontSize(textElement);

        while (textHeight >= containerHeight) {
            textElement.style.fontSize = --fontSize + 'px';
            textHeight = realHeight(textElement);
        }
    },

    /**
     * Async sleep method.
     *
     * @param ms
     * @returns {Promise} sleeps for the provided duration
     */
    sleep(ms = 0) {
        return new Promise(r => setTimeout(r, ms));
    }

};