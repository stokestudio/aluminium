import { identity } from 'lodash';
import React, { PropTypes } from 'react';
import FormValidation from './FormValidation';

const { isDataValid, runFieldValidations } = FormValidation;

const ENTER_KEY = 13;

class FieldHandler extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    displayFormatter: PropTypes.func,
    displayIfInvalid: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    submitOnEnter: PropTypes.bool.isRequired,
    validations: PropTypes.arrayOf(PropTypes.func),
    valueParser: PropTypes.func
  }

  static defaultProps = {
    displayFormatter: identity,
    submitOnEnter: true,
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
    const { valid: isValid, message: errorMessage } =
      runFieldValidations(value, validations);

    const api = {
      displayInvalid: (displayIfInvalid || hasBlurred) && !isValid,
      displayValue: displayFormatter(value) || '',
      onBlur: () => this.setState({ hasBlurred: true }),
      onChange: ::this.onChange,
      onKeyUp: ::this.onKeyUp,
      onSubmit,
      onValueChange: value => onValueChange(name, valueParser(value)),
      value: data[name]
    };

    if (api.displayInvalid) api.errorMessage = errorMessage;

    return children({
      ...api,
      inputProps: {
        onBlur: api.onBlur,
        onChange: api.onChange,
        onKeyUp: api.onKeyUp,
        value: api.displayValue
      }
    });
  }

  onChange(event) {
    const { name, onValueChange, valueParser } = this.props;
    const { value } = event.target;
    onValueChange(name, valueParser(value));
  }

  onKeyUp(event) {
    if (this.props.submitOnEnter && event.keyCode === ENTER_KEY) {
      // Hides keyboard on iOS
      event.target.blur();

      this.props.onSubmit();
    }
  }
}

const SubmitHandler = ({ children, disabled, onSubmit }) => children({
  disabled,
  submit: onSubmit
});

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
        validations={this.props.validations[inputProps.name]}
        onSubmit={::this.onSubmit}
        onValueChange={::this.onValueChange} />;

    this.SubmitHandler = submitProps =>
      <SubmitHandler {...submitProps}
        disabled={!isDataValid(this.state.data, this.props.validations)}
        onSubmit={::this.onSubmit} />;
  }

  render() {
    return this.props.children({
      FieldHandler: this.FieldHandler,
      SubmitHandler: this.SubmitHandler
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
