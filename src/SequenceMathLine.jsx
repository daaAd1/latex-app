import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

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
ktorý hovorí o tom či sa komponent zobrazí a atribút, ktorý zabraňuje upravovaniu vstupného poľa komponentu.
Komponent posiela rodičovi svoju dĺžku, keď používateľ klikne na čiaru, nový text dôkazu, 
ak bol pôvodný upravený a nový text podmienky, ak bola zmenená.
*/

class SequenceMathLine extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      level: props.level,
      cell: props.cell,
      length: this.getInitialLength(),
      white: props.white,
      inputText: this.getInitialText(),
      annotation: this.getInitialAnnotation(),
      annotationText: this.getInitialAnnotationText(),
      readonlyText: props.readonlyText,
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.white !== this.state.white) {
      this.setState({ white: nextProps.white });
    }
    if (nextProps.readonlyAnnot !== this.state.readonlyAnnot) {
      this.setState({
        readonlyAnnot: nextProps.readonlyAnnot,
      });
    }
    if (nextProps.readonlyText !== this.state.readonlyText) {
      this.setState({
        readonlyText: nextProps.readonlyText,
      });
    }
  }

  onChange(event) {
    this.setState({
      inputText: event.target.value,
    });
    localStorage.setItem(
      `math-line-text-${this.props.level}${this.props.cell}`,
      event.target.value,
    );
    this.props.changedText(this.state.level, this.state.cell, event.target.value);
  }

  onClick() {
    if (this.state !== null && this.state.length === 3) {
      this.setState(
        {
          annotation: false,
          length: 0,
        },
        () => {
          localStorage.setItem(`math-line-length-${this.state.level}${this.state.cell}`, 0);
          localStorage.setItem(`math-line-annotation-${this.state.level}${this.state.cell}`, false);
          this.props.onClick(this.state.length);
        },
      );
    } else {
      this.setState(
        {
          annotation: true,
          length: this.state.length + 1,
        },
        () => {
          localStorage.setItem(
            `math-line-length-${this.state.level}${this.state.cell}`,
            this.state.length,
          );
          localStorage.setItem(`math-line-annotation-${this.state.level}${this.state.cell}`, true);
          this.props.onClick(this.state.length);
        },
      );
    }
  }

  getInitialText() {
    const text = localStorage.getItem(`math-line-text-${this.props.level}${this.props.cell}`) || '';
    return text;
  }

  getInitialLength() {
    const length =
      Number(localStorage.getItem(`math-line-length-${this.props.level}${this.props.cell}`)) || 0;
    return length;
  }

  getInitialAnnotation() {
    let annotation = localStorage.getItem(
      `math-line-annotation-${this.props.level}${this.props.cell}`,
    );
    if (annotation === 'true') {
      annotation = true;
    } else {
      annotation = false;
    }
    return annotation;
  }

  getInitialAnnotationText() {
    const annotationText =
      localStorage.getItem(`math-line-annotation-text-${this.props.level}${this.props.cell}`) ||
      this.props.annotationText;
    return annotationText;
  }

  annotationChanged(event) {
    this.setState({
      annotationText: event.target.value,
    });
    localStorage.setItem(
      `math-line-annotation-text-${this.state.level}${this.state.cell}`,
      event.target.value,
    );
    this.props.annotationChanged(this.state.level, this.state.cell, event.target.value);
  }

  render() {
    let className = ' ';
    let inputClassName = ' sequence-cell-text ';
    if (this.state.white) {
      className += ' sequence-cell-length-white ';
      inputClassName += ' sequence-cell-text-no-input ';
    } else if (this.state.length === 0) {
      className += ' sequence-cell-length-0 ';
    } else if (this.state.length === 1) {
      className += ' sequence-cell-length-1 ';
    } else if (this.state.length === 2) {
      className += ' sequence-cell-length-2 ';
    } else if (this.state.length === 3) {
      className += ' sequence-cell-length-3 ';
    }
    return (
      <div className="sequence-line">
        <div className="sequence-line-annotation">
          <div role="button" className={className} onClick={this.onClick} tabIndex={0} />
          {this.state.annotation && (
            <TextareaAutosize
              type="text"
              className="sequence-annotation-text"
              onChange={this.annotationChanged}
              value={this.state.annotationText}
            />
          )}
        </div>
        <TextareaAutosize
          readOnly={this.state.readonlyText}
          value={this.state.inputText}
          className={inputClassName}
          type="text"
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default SequenceMathLine;
