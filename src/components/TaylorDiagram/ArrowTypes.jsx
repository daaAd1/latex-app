import React from 'react';
import PropTypes from 'prop-types';
import ArrowRadioType from './ArrowRadioType';

const ArrowTypes = (props) => {
  const { types, currentType } = props;
  return (
    <div className="modal-types">
      Arrow types:
      {types.map((type) => (
        <ArrowRadioType
          key={type}
          type={type}
          checked={currentType === type}
          onTypeChange={props.onTypeChange}
        />
      ))}
    </div>
  );
};

ArrowTypes.propTypes = {
  currentType: PropTypes.string.isRequired,
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

export default ArrowTypes;
