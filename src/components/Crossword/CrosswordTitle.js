/**
 *
 * @author alex
 */

import React from 'react';
import './CrosswordTitle.css';

class CrosswordTitle extends React.Component {

    render() {
        return (<div className='crossword-title'>{this.props.title}</div>)
    }

}

module.exports = CrosswordTitle;