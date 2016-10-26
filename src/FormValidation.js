import { every, find, isNan, isString, mapValues } from 'lodash';

const is = (validation, errorMessage) => value =>
  validation(value)
    ? { valid: true }
    : { valid: false, message: errorMessage };

const Validations = {
  is,
  required: is(
    value =>
      typeof value !== 'undefined'
        && (!isString(value) || value.length > 0)
        && !isNan(value),
    'Required'
  )
};

const runFieldValidations = (value, fieldValidations) => {
  const erroringValidation = find(fieldValidations, fn => !fn(value).valid);
  return erroringValidation ? erroringValidation(value) : { valid: true };
};

const runFormValidations = (data, formValidations) =>
  mapValues(formValidations, (fieldValidations, field) =>
    runFieldValidations(data[field], fieldValidations)
  );

const isDataValid = (data, formValidations) => {
  if (!data) return false;
  const results = runFormValidations(data, formValidations);
  return every(results, result => result.valid);
};

export default {
  Validations,
  isDataValid,
  runFieldValidations,
  runFormValidations
};
