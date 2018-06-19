import React from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';

class ArrowTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    this.props.onTextChange(event.target.value, this.props.number);
  }

  render() {
    const { text, number } = this.props;

    const textId = `arrow-text-${number}`;
    let titleText = 'Arrow text:';
    if (number !== 1) {
      titleText = `Arrow text ${number}:`;
    }

    return (
      <label htmlFor="arrow-text">
        {' '}
        <p>{titleText}</p>
        <TextareaAutosize type="text" id={textId} value={text} onChange={this.handleTextChange} />
      </label>
    );
  }
}

ArrowTextInput.propTypes = {
  number: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
};

export default ArrowTextInput;
