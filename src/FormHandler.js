import { identity } from 'lodash';
import React, { PropTypes } from 'react';
import FormValidations from './FormValidations';

const { isDataValid, runFieldValidations } = FormValidations;

class FieldHandler extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    displayFormatter: PropTypes.func,
    displayIfInvalid: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    validations: PropTypes.arrayOf(PropTypes.func),
    valueParser: PropTypes.func
  }

  static defaultProps = {
    displayFormatter: identity,
    valueParser: identity
  }

  state = { hasBlurred: false }

  render () {
    const {
      children,
      data,
      displayFormatter,
      displayIfInvalid,
      name,
      onSubmit,
      onValueChange,
      validations,
      valueParser
    } = this.props;
    const { hasBlurred } = this.state;

    const value = data[name];
    const isValid = runFieldValidations(value, validations).valid;

    const api = {
      displayInvalid: (displayIfInvalid || hasBlurred) && !isValid,
      displayValue: displayFormatter(value) || '',
      isValid: isValid,
      onBlur: () => this.setState({ hasBlurred: true }),
      onChange: ::this.onChange,
      onSubmit,
      onValueChange: value => onValueChange(name, valueParser(value)),
      value: data[name]
    };

    return children({
      ...api,
      inputProps: {
        onBlur: api.onBlur,
        onChange: api.onChange,
        value: api.displayValue
      }
    });
  }

  onChange(event) {
    const { name, onValueChange, valueParser } = this.props;
    const { value } = event.target;
    onValueChange(name, valueParser(value));
  }
}

class FormHandler extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    onDataChange: PropTypes.func,
    onSubmit: PropTypes.func,
    validations: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.func)).isRequired
  }

  constructor(props) {
    super(props);
    this.state = { data: props.data || {} };

    this.FieldHandler = inputProps =>
      <FieldHandler {...inputProps}
        data={this.state.data}
        displayIfInvalid={this.state.displayInvalidFields}
        validations={props.validations[inputProps.name]}
        onSubmit={::this.onSubmit}
        onValueChange={::this.onValueChange} />;
  }

  render() {
    return this.props.children({
      FieldHandler: this.FieldHandler
    });
  }

  onSubmit() {
    const { validations } = this.props;
    const { data } = this.state;

    if (isDataValid(data, validations)) {
      const { onSubmit } = this.props;
      if (onSubmit) onSubmit();
    } else {
      this.setState({ displayInvalidFields: true });
    }
  }

  onValueChange(name, value) {
    const { onDataChange } = this.props;
    const { data } = this.state;

    const newData = { ...data, [name]: value };
    this.setState({ data: newData });

    if (onDataChange) onDataChange(newData);
  }
}

export default FormHandler;
