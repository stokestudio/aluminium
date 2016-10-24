import React, { PropTypes } from 'react';

const isBrowser = typeof document !== 'undefined';

export default class OutsideClickDetector extends React.Component {
  constructor(props) {
    super(props);
    this.onBodyClick = this.onBodyClick.bind(this);
  }

  componentDidMount() {
    if (isBrowser)
      document.body.addEventListener('click', this.onBodyClick);
  }

  componentWillUnmount() {
    if (isBrowser)
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

OutsideClickDetector.propTypes = {
  children: PropTypes.node.isRequired,
  onOutsideClick: PropTypes.func.isRequired
};
