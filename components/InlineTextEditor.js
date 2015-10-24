import React from 'react';
import _ from 'underscore';
import { OutsideClickDetector } from '../';
import styles from './InlineTextEditor.scss';

const KEYS = {
  enter: 13,
  escape: 27
};

export default class InlineTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
  }

  render() {
    const renderMode = this.state.editMode ? ::this.renderInput : ::this.renderText;

    return (
      <div className={styles.root}>{renderMode()}</div>
    );
  }

  renderInput() {
    return (
      <OutsideClickDetector onOutsideClick={::this.onOutsideClick}>
        <input ref="input" type="text" className={styles.input}
          value={this.state.editValue} onChange={::this.onInputChange}
          onKeyUp={::this.onInputKeyUp} />
      </OutsideClickDetector>
    );
  }

  renderText() {
    if (this.props.value) {
      return (
        <div className={styles.textContainer} onClick={::this.onTextClick}>
          <div>{this.props.value}</div>
        </div>
      );
    } else {
      return (
        <div className={styles.textContainer} onClick={::this.onTextClick}>
          <div className={styles.placeholder}>{this.props.placeholder}</div>
        </div>
      );
    }
  }

  onOutsideClick() {
    const newValue = this.refs.input.value;
    if (this.props.value !== newValue) {
      this.props.onChange(newValue);
    }
    this.setState({ editMode: false });
  }

  onInputChange(event) {
    this.setState({ editValue: event.target.value });
  }

  onInputKeyUp(event) {
    switch (event.keyCode) {
      case KEYS.enter:
        this.props.onChange(event.target.value);
      case KEYS.escape:
        this.setState({ editMode: false });
    }
  }

  onTextClick() {
    this.setState({ editMode: true, editValue: this.props.value });

    _.defer(() => {
      const { input } = this.refs;
      if (input) {
        input.focus();
        input.setSelectionRange(0, input.value.length);
      }
    });
  }
}
