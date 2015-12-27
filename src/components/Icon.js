// Adopted from https://github.com/dmfrancisco/react-icons/

import React from 'react';
import _ from 'underscore';

// More icons: http://dmfrancisco.github.io/react-icons/
const paths = {
  'arrow-back': 'M20 11h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17v-2z',
  'arrow-drop-down': 'M7 10l5 5 5-5z',
  'arrow-drop-up': 'M7 14l5-5 5 5z',
  clear: 'M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z',
  comment: 'M21.99 4c0-1.1-.89-2-1.99-2h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zm-3.99 10h-12v-2h12v2zm0-3h-12v-2h12v2zm0-3h-12v-2h12v2z',
  'file-upload': 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2h-14z'
};

export default class Icon extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    style: React.PropTypes.object
  }

  static defaultProps = {
    size: 24
  }

  render() {
    const styles = {
      fill: "currentColor",
      verticalAlign: "middle",
      width: this.props.size, // CSS instead of the width attr to support non-pixel units
      height: this.props.size // Prevents scaling issue in IE
    };
    const otherProps = _.omit(this.props, 'icon', 'size', 'style');

    return (
      <svg {...otherProps} viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet" fit
        style={_.extend({}, styles, this.props.style)}>
        <g><path d={paths[this.props.icon]}></path></g>
      </svg>
    );
  }
}
