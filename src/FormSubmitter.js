import { isUndefined, map } from 'lodash';
import React, { PropTypes } from 'react';

class FormSubmitter extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
  }

  // Public
  submit() {
    this.refs.form.submit();
  }

  render() {
    const { data, url } = this.props;

    return (
      <form ref="form" method="POST" action={url}>
        {map(data, (value, key) =>
          !isUndefined(value) &&
            <input key={key} type="hidden" name={key} value={value} />
        )}
      </form>
    );
  }
}

export default FormSubmitter;
