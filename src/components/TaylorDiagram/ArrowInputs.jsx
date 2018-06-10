import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import ArrowTextInput from './ArrowTextInput';

const ArrowInputs = (props) => {
  const { texts } = props;
  return (
    <div className="modal-text">
      {texts.map((text, index) => (
        <ArrowTextInput
          key={shortid.generate()}
          text={text}
          number={index + 1}
          onTextChange={(textValue, number) => props.onTextChange(textValue, number)}
        />
      ))}
    </div>
  );
};

ArrowInputs.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ArrowInputs;
