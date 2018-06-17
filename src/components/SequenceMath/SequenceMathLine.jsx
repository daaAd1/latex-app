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

/*  global console: false, */

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
  static returnInputCellClassname(white) {
    return white ? ' sequence-cell-text sequence-cell-text-no-input ' : ' sequence-cell-text ';
  }

  static returnLengthDivClassName(length, white) {
    if (white) {
      return ' sequence-cell-length-white ';
    } else if (length === 1) {
      return ' sequence-cell-length-1 ';
    } else if (length === 2) {
      return ' sequence-cell-length-2 ';
    } else if (length === 3) {
      return ' sequence-cell-length-3 ';
    }
    return ' sequence-cell-length-0 ';
  }

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
      this.props.onLengthChange(this.props.level, this.props.cell, 0);
    } else {
      this.props.onLengthChange(this.props.level, this.props.cell, this.props.length + 1);
    }
  }

  handleAnnotationChange(event) {
    this.props.onAnnotationChange(this.props.level, this.props.cell, event.target.value);
  }

  render() {
    const { white, inputText, length, annotation, annotationText, readonlyText } = this.props;
    const inputClassName = SequenceMathLine.returnInputCellClassname(white);
    const lengthClassName = SequenceMathLine.returnLengthDivClassName(length, white);

    return (
      <div className="sequence-line">
        <div className="sequence-line-annotation">
          <div
            role="button"
            className={lengthClassName}
            onClick={this.handleLengthChange}
            onKeyPress={this.handleLengthChange}
            tabIndex={0}
            data-testid="line-length"
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
