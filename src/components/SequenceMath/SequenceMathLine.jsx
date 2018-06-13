import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: SequenceMathLine
**
*/

/*  global localStorage: false, console: false, */

/*
Komponent, ktorý pozostáva z čiary, ktorá určuje počet potomkov, zo vstupného poľa dôkazu
a vstupného poľa podmienky pri dôkaze. Z týchto komponentov pozostáva hlavný komponent SequenceMath.
*/

/*
Komponent dostáva od rodiča - level/riadok, bunku/stĺpec, atribút,
ktorý hovorí o tom či sa komponent zobrazí a atribút,
ktorý zabraňuje upravovaniu vstupného poľa komponentu.
Komponent posiela rodičovi svoju dĺžku, keď používateľ klikne na čiaru, nový text dôkazu,
ak bol pôvodný upravený a nový text podmienky, ak bola zmenená.
*/

class SequenceMathLine extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
  }

  handleTextChange(event) {
    this.props.onTextChange(this.props.level, this.props.cell, event.target.value);
  }

  handleLengthChange() {
    if (this.props.length === 3) {
      this.props.onLengthChange(0);
    } else {
      this.props.onLengthChange(this.props.length + 1);
    }
  }

  handleAnnotationChange(event) {
    this.props.onAnnotationChange(this.props.level, this.props.cell, event.target.value);
  }

  render() {
    let className = ' ';
    let inputClassName = ' sequence-cell-text ';
    if (this.props.white) {
      className += ' sequence-cell-length-white ';
      inputClassName += ' sequence-cell-text-no-input ';
    } else if (this.props.length === 1) {
      className += ' sequence-cell-length-1 ';
    } else if (this.props.length === 2) {
      className += ' sequence-cell-length-2 ';
    } else if (this.props.length === 3) {
      className += ' sequence-cell-length-3 ';
    } else {
      className += ' sequence-cell-length-0 ';
    }
    const { annotation, annotationText, readonlyText, inputText } = this.props;
    return (
      <div className="sequence-line">
        <div className="sequence-line-annotation">
          <div
            role="button"
            className={className}
            onClick={this.handleLengthChange}
            onKeyPress={this.handleLengthChange}
            tabIndex={0}
          />
          {annotation && (
            <TextareaAutosize
              type="text"
              className="sequence-annotation-text"
              onChange={this.handleAnnotationChange}
              value={annotationText}
            />
          )}
        </div>
        <TextareaAutosize
          readOnly={readonlyText}
          value={inputText}
          className={inputClassName}
          type="text"
          onChange={this.handleTextChange}
        />
      </div>
    );
  }
}

SequenceMathLine.propTypes = {
  annotation: PropTypes.bool,
  inputText: PropTypes.string,
  annotationText: PropTypes.string,
  length: PropTypes.number,
  readonlyText: PropTypes.bool,
  onAnnotationChange: PropTypes.func,
  onLengthChange: PropTypes.func,
  onTextChange: PropTypes.func,

  level: PropTypes.number.isRequired,
  cell: PropTypes.number.isRequired,
  white: PropTypes.bool.isRequired,
};

SequenceMathLine.defaultProps = {
  annotation: false,
  inputText: '',
  annotationText: '',
  length: 0,
  readonlyText: false,
  onAnnotationChange: () => {},
  onLengthChange: () => {},
  onTextChange: () => {},
};

export default SequenceMathLine;
