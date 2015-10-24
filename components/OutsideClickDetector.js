import React from 'react';
import _ from 'underscore';

export default class OutsideClickDetector extends React.Component {
  constructor(props) {
    super(props);
    _.bindAll(this, 'onBodyClick');
  }

  componentDidMount() {
    document.body.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.onBodyClick);
  }

  render() {
    return (
      <div ref="root">{this.props.children}</div>
    );
  }

  onBodyClick(event) {
    if (!this.refs.root.contains(event.target)) {
      this.props.onOutsideClick(event);
    }
  }
}
