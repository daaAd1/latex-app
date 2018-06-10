import React from 'react';
import PropTypes from 'prop-types';

const ArrowRadioType = (props) => {
  const { type, checked } = props;
  return (
    <div>
      <label htmlFor={type}>
        <input
          onChange={props.onTypeChange}
          type="radio"
          value={type}
          id={type}
          checked={checked}
        />
        {type}
      </label>
    </div>
  );
};

ArrowRadioType.propTypes = {
  checked: PropTypes.bool,

  type: PropTypes.string.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

ArrowRadioType.defaultProps = {
  checked: false,
};

export default ArrowRadioType;
