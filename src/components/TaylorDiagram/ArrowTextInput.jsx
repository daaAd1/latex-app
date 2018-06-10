import React from 'react';
import PropTypes from 'prop-types';

const ArrowTextInput = (props) => {
  const { text, number } = props;

  const textId = `arrow-text-${number}`;
  let titleText = 'Arrow text:';
  if (number !== 1) {
    titleText = `Arrow text ${number}:`;
  }

  return (
    <label htmlFor="arrow-text">
      {' '}
      <p>{titleText}</p>
      <input
        type="text"
        id={textId}
        value={text}
        onChange={(event) => props.onTextChange(event.target.value, number)}
      />
    </label>
  );
};

ArrowTextInput.propTypes = {
  number: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
};

export default ArrowTextInput;
