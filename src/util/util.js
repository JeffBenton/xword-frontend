import {directions} from './constants.js';

module.exports = {

    otherDirection: function(direction) {
        if (direction === directions[0]) {
            return directions[1];
        } else if (direction === directions[1]) {
            return directions[0];
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
    }

};