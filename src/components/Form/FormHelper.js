/**
 * Manages form elements. Maintains a lookup of form element classes so we can
 * generate them based on a form schema.
 *
 * ok it's really just a singleton map.
 */
class FormHelper {

    constructor() {
        this.elements = {};
    }

    /**
     * Get all the keys from the elements map.
     *
     * @returns {Array}
     */
    keys() {
        return Object.keys(this.elements);
    }

    /**
     * Register a form element with the provided key.
     *
     * @param key
     *      string to use as the element key
     * @param element
     *      the Form element to store
     */
    registerFormElement(key, element) {
        this.elements[key] = element;
    }

    /**
     * Get a form element by key.
     *
     * @param key
     * @returns {*}
     *      the form element. throws an exception if the form element can't be found.
     */
    elementForType(key) {
        let element = this.elements[key];
        if (!element) {
            throw 'couldn\'t find a form element for type: ' + type;
        }
        return element;
    }
}

module.exports = new FormHelper();