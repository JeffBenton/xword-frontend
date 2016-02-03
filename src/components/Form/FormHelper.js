/**
 *
 * @author alex
 */

class FormHelper {

    constructor() {
        this.elements = {};
    }

    getAllKeys() {
        let keys = [];
        for (let key in this.elements) {
            keys.push(key);
        }
        return keys;
    }

    registerFormElement(key, element) {
        this.elements[key] = element;
    }

    elementForType(type) {
        let element = this.elements[type];
        if (!element) {
            throw 'couldn\'t find a form element for type: ' + type;
        }
        return element;
    }
}

module.exports = new FormHelper();