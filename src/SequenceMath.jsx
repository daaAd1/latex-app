import React from 'react';
import LatexCode from './LatexCode';
import Symbols from './Symbols';
import SequenceMathLine from './SequenceMathLine';

/*  global localStorage: false, console: false, window: false */

class SequenceMath extends React.Component {
  static resetApplicationState() {
    window.localStorage.clear();
    window.location.reload();
  }

  constructor(props) {
    super(props);
    this.state = {
      lines: this.getInitialLinesObject(),
      linesText: this.getInitialTextObject(),
      latexCode: this.generateLatexCode(),
      annotationObject: this.getInitialAnnotationObject(),
    };

    this.lineClick = this.lineClick.bind(this);
    this.generateLinesObject = this.generateLinesObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
    this.addLineToObject = this.addLineToObject.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        linesText: this.generateTextObject(),
        linesObject: this.generateLinesObject(),
        annotationObject: this.generateAnnotationObject(),
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
  }

  getInitialLinesObject() {
    const linesObject =
      JSON.parse(localStorage.getItem('math-line-object')) || this.generateLinesObject();
    return linesObject;
  }

  getInitialTextObject() {
    const textObject =
      JSON.parse(localStorage.getItem('math-text-object')) || this.generateTextObject();
    return textObject;
  }

  getInitialAnnotationObject() {
    const annotObject =
      JSON.parse(localStorage.getItem('math-annotation-object')) || this.generateAnnotationObject();
    return annotObject;
  }

  generateTextObject() {
    let initialObject;
    if (this.state !== undefined && this.state.linesText !== undefined) {
      initialObject = this.state.linesText;
    } else {
      initialObject = {};
    }
    const numOfRows = 5;
    const numOfColumns = 81;
    for (let level = 0; level < numOfRows; level += 1) {
      for (let levelCell = 0; levelCell < numOfColumns; levelCell += 1) {
        const position = level.toString() + levelCell.toString();
        if (level === 0 && levelCell < 2) {
          if (
            this.state !== undefined &&
            this.state.linesText !== undefined &&
            this.state.linesText[position] !== undefined
          ) {
            initialObject[position] = this.state.linesText[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 1 && levelCell < 4) {
          if (
            this.state !== undefined &&
            this.state.linesText !== undefined &&
            this.state.linesText[position] !== undefined
          ) {
            initialObject[position] = this.state.linesText[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 2 && levelCell < 10) {
          if (
            this.state !== undefined &&
            this.state.linesText !== undefined &&
            this.state.linesText[position] !== undefined
          ) {
            initialObject[position] = this.state.linesText[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 3 && levelCell < 28) {
          if (
            this.state !== undefined &&
            this.state.linesText !== undefined &&
            this.state.linesText[position] !== undefined
          ) {
            initialObject[position] = this.state.linesText[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 4) {
          if (
            this.state !== undefined &&
            this.state.linesText !== undefined &&
            this.state.linesText[position] !== undefined
          ) {
            initialObject[position] = this.state.linesText[position];
          } else {
            initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  addLineToObject(level, levelCell, length) {
    const key = level.toString() + levelCell.toString();
    const obj = this.state.lines;
    obj[key] = length;
    this.setState(
      {
        lines: obj,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
    localStorage.setItem('math-line-object', JSON.stringify(obj));
  }

  addTextToObject(level, levelCell, text) {
    const key = level.toString() + levelCell.toString();
    const obj = this.state.linesText;
    obj[key] = text;
    this.setState(
      {
        linesText: obj,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
    localStorage.setItem('math-text-object', JSON.stringify(obj));
  }

  generateLatexCode() {
    const beginCode = [' &#92;begin{prooftree}'];
    const endCode = [' &#92;end{prooftree}'];
    const middleCode = [];

    for (let level = 4; level > 0; level -= 1) {
      for (let levelCell = 1; levelCell < 28; levelCell += 1) {
        let row = '';
        const position = level.toString() + levelCell.toString();
        if (
          levelCell <= Math.pow(3, level) / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            const positionOfText = (level + 1).toString() + (levelCell * 3).toString();
            const positionOfTextTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
            const positionOfTextThree = (level + 1).toString() + (levelCell * 3 - 2).toString();
            if (
              this.state.linesText[positionOfText] === '' &&
              this.state.linesText[positionOfTextTwo] === '' &&
              this.state.linesText[positionOfTextThree] === ''
            ) {
              row = `     &#92;AxiomC{${this.state.linesText[position]}}`;
            } else {
              if (this.state.annotationObject[position] !== '') {
                row = `     &#92;RightLabel{&#92;scriptsize(${
                  this.state.annotationObject[position]
                })}`;
                middleCode.push(row);
              }
              let numberOfNodes = 0;
              if (this.state.linesText[positionOfText] !== '') {
                numberOfNodes += 1;
              }
              if (this.state.linesText[positionOfTextTwo] !== '') {
                numberOfNodes += 1;
              }
              if (this.state.linesText[positionOfTextThree] !== '') {
                numberOfNodes += 1;
              }
              if (numberOfNodes === 1) {
                row = `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
              } else if (numberOfNodes === 2) {
                row = `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
              } else if (numberOfNodes === 3) {
                row = `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
              }
            }
          }
        }
        if (row !== '') {
          middleCode.push(row);
        }
      }
    }

    for (let level = 4; level > 0; level -= 1) {
      for (let levelCell = 1; levelCell < 55; levelCell += 1) {
        let row = '';
        const position = level.toString() + levelCell.toString();
        if (
          levelCell > Math.pow(3, level) / 3 &&
          levelCell <= Math.pow(3, level) * 2 / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            const positionOfText = (level + 1).toString() + (levelCell * 3).toString();
            const positionOfTextTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
            const positionOfTextThree = (level + 1).toString() + (levelCell * 3 - 2).toString();
            if (
              this.state.linesText[positionOfText] === '' &&
              this.state.linesText[positionOfTextTwo] === '' &&
              this.state.linesText[positionOfTextThree] === ''
            ) {
              row = `     &#92;AxiomC{${this.state.linesText[position]}}`;
            } else {
              if (this.state.annotationObject[position] !== '') {
                row = `     &#92;RightLabel{&#92;scriptsize(${
                  this.state.annotationObject[position]
                }}`;
                middleCode.push(row);
              }
              let numberOfNodes = 0;
              if (this.state.linesText[positionOfText] !== '') {
                numberOfNodes += 1;
              }
              if (this.state.linesText[positionOfTextTwo] !== '') {
                numberOfNodes += 1;
              }
              if (this.state.linesText[positionOfTextThree] !== '') {
                numberOfNodes += 1;
              }
              if (numberOfNodes === 1) {
                row = `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
              } else if (numberOfNodes === 2) {
                row = `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
              } else if (numberOfNodes === 3) {
                row = `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
              }
            }
          }
        }
        if (row !== '') {
          middleCode.push(row);
        }
      }
    }
    for (let level = 4; level > -1; level -= 1) {
      for (let levelCell = 0; levelCell < 82; levelCell += 1) {
        let row = '';
        const position = level.toString() + levelCell.toString();
        if (
          levelCell > Math.pow(3, level) * 2 / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            const positionOfText = (level + 1).toString() + (levelCell * 3).toString();
            const positionOfTextTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
            const positionOfTextThree = (level + 1).toString() + (levelCell * 3 - 2).toString();
            if (
              this.state.linesText[positionOfText] === '' &&
              this.state.linesText[positionOfTextTwo] === '' &&
              this.state.linesText[positionOfTextThree] === ''
            ) {
              row = `     &#92;AxiomC{${this.state.linesText[position]}}`;
            } else {
              if (this.state.annotationObject[position] !== '') {
                row = `     &#92;RightLabel{&#92;scriptsize(${
                  this.state.annotationObject[position]
                })}`;
                middleCode.push(row);
              }
              let numberOfNodes = 0;
              if (this.state.linesText[positionOfText] !== '') {
                numberOfNodes += 1;
              }
              if (this.state.linesText[positionOfTextTwo] !== '') {
                numberOfNodes += 1;
              }
              if (this.state.linesText[positionOfTextThree] !== '') {
                numberOfNodes += 1;
              }
              if (numberOfNodes === 1) {
                row = `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
              } else if (numberOfNodes === 2) {
                row = `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
              } else if (numberOfNodes === 3) {
                row = `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
              }
            }
          }
        }
        if (row !== '') {
          middleCode.push(row);
        }
      }
    }

    return [beginCode, middleCode.join('\n'), endCode].join('\n');
  }

  generateLinesObject() {
    let initialObject;
    if (this.state !== undefined && this.state.linesObject !== undefined) {
      initialObject = this.state.linesObject;
    } else {
      initialObject = {};
    }
    const numOfRows = 5;
    const numOfColumns = 81;
    for (let level = 0; level < numOfRows; level += 1) {
      for (let levelCell = 0; levelCell < numOfColumns; levelCell += 1) {
        const position = level.toString() + levelCell.toString();
        if (level === 0 && levelCell < 2) {
          if (
            this.state !== undefined &&
            this.state.linesObject !== undefined &&
            this.state.linesObject[position] !== undefined
          ) {
            initialObject[position] = this.state.linesObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 1 && levelCell < 4) {
          if (
            this.state !== undefined &&
            this.state.linesObject !== undefined &&
            this.state.linesObject[position] !== undefined
          ) {
            initialObject[position] = this.state.linesObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 2 && levelCell < 10) {
          if (
            this.state !== undefined &&
            this.state.linesObject !== undefined &&
            this.state.linesObject[position] !== undefined
          ) {
            initialObject[position] = this.state.linesObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 3 && levelCell < 28) {
          if (
            this.state !== undefined &&
            this.state.linesObject !== undefined &&
            this.state.linesObject[position] !== undefined
          ) {
            initialObject[position] = this.state.linesObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 4) {
          if (
            this.state !== undefined &&
            this.state.linesObject !== undefined &&
            this.state.linesObject[position] !== undefined
          ) {
            initialObject[position] = this.state.linesObject[position];
          } else {
            initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  generateAnnotationObject() {
    let initialObject;
    if (this.state !== undefined && this.state.annotationObject !== undefined) {
      initialObject = this.state.annotationObject;
    } else {
      initialObject = {};
    }
    const numOfRows = 5;
    const numOfColumns = 81;
    for (let level = 0; level < numOfRows; level += 1) {
      for (let levelCell = 0; levelCell < numOfColumns; levelCell += 1) {
        const position = level.toString() + levelCell.toString();
        if (level === 0 && levelCell < 2) {
          if (
            this.state !== undefined &&
            this.state.annotationObject !== undefined &&
            this.state.annotationObject[position] !== undefined
          ) {
            initialObject[position] = this.state.annotationObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 1 && levelCell < 4) {
          if (
            this.state !== undefined &&
            this.state.annotationObject !== undefined &&
            this.state.annotationObject[position] !== undefined
          ) {
            initialObject[position] = this.state.annotationObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 2 && levelCell < 10) {
          if (
            this.state !== undefined &&
            this.state.annotationObject !== undefined &&
            this.state.annotationObject[position] !== undefined
          ) {
            initialObject[position] = this.state.annotationObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 3 && levelCell < 28) {
          if (
            this.state !== undefined &&
            this.state.annotationObject !== undefined &&
            this.state.annotationObject[position] !== undefined
          ) {
            initialObject[position] = this.state.annotationObject[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 4) {
          if (
            this.state !== undefined &&
            this.state.annotationObject !== undefined &&
            this.state.annotationObject[position] !== undefined
          ) {
            initialObject[position] = this.state.annotationObject[position];
          } else {
            initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  annotationChanged(level, cell, annotText) {
    const key = level.toString() + cell.toString();
    const obj = this.state.annotationObject;
    obj[key] = annotText;
    this.setState(
      {
        annotationObject: obj,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
    localStorage.setItem('math-annotation-object', JSON.stringify(obj));
  }

  lineClick(level, cell, length) {
    if (
      this.state.lines[level.toString() + cell.toString()] === 'false' ||
      this.state.lines[level.toString() + cell.toString()] === ''
    ) {
      this.addLineToObject(level, cell, length);
    } else {
      this.addLineToObject(level, cell, length);
    }
  }

  pushCell(level, cell) {
    const boolTrue = true;
    const boolFalse = false;
    const position = level.toString() + cell.toString();
    let positionOneLevelDown = (level - 1).toString() + (cell / 2).toString();
    let levelNotHighEnough = false;

    if ((cell + 2) % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + ((cell + 2) / 3).toString();
      if (this.state.lines[positionOneLevelDown] < 1) {
        levelNotHighEnough = true;
      }
    } else if ((cell + 1) % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + ((cell + 1) / 3).toString();
      if (this.state.lines[positionOneLevelDown] < 2) {
        levelNotHighEnough = true;
      }
    } else if (cell % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + (cell / 3).toString();
      if (this.state.lines[positionOneLevelDown] < 3) {
        levelNotHighEnough = true;
      }
    }
    let readonlyAnnot = false;
    let readonlyText = true;
    if (this.state.linesText[positionOneLevelDown] !== '') {
      readonlyText = false;
    }
    const positionChildrenOne = (level + 1).toString() + (cell * 3).toString();
    const positionChildrenTwo = (level + 1).toString() + (cell * 3 - 1).toString();
    const positionChildrenThree = (level + 1).toString() + (cell * 3 - 2).toString();

    if (
      this.state.linesText[positionChildrenOne] === '' &&
      this.state.linesText[positionChildrenTwo] === '' &&
      this.state.linesText[positionChildrenThree] === ''
    ) {
      readonlyAnnot = true;
    }

    let annotationText = '';
    if (this.state !== undefined && this.state.annotationObject !== undefined) {
      annotationText = this.state.annotationObject[position];
    }
    if (!levelNotHighEnough && this.state !== null && this.state.lines[position] > 0) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            changedText={this.addTextToObject}
            white={boolFalse}
            level={level}
            cell={cell}
            onClick={length => this.lineClick(level, cell, length)}
            annotationChanged={this.annotationChanged}
            annotationText={annotationText}
            clicked
            readonlyAnnot={readonlyAnnot}
            readonlyText={readonlyText}
          />
        </div>
      );
    } else if (
      !levelNotHighEnough &&
      this.state !== null &&
      this.state.lines[positionOneLevelDown] > 0
    ) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            changedText={this.addTextToObject}
            white={boolFalse}
            level={level}
            cell={cell}
            onClick={length => this.lineClick(level, cell, length)}
            annotationChanged={this.annotationChanged}
            annotationText={annotationText}
            clicked={false}
            readonlyAnnot={readonlyAnnot}
            readonlyText={readonlyText}
          />
        </div>
      );
    } else if (level === 0) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            changedText={this.addTextToObject}
            white={boolFalse}
            level={level}
            cell={cell}
            onClick={length => this.lineClick(level, cell, length)}
            annotationChanged={this.annotationChanged}
            annotationText={annotationText}
            clicked={false}
            readonlyAnnot={readonlyAnnot}
            readonlyText={readonlyText}
          />
        </div>
      );
    }
    return (
      <div key={position} className="sequence-level-cells">
        <SequenceMathLine
          white={boolTrue}
          level={level}
          cell={cell}
          annotationText={annotationText}
          clicked={false}
        />
      </div>
    );
  }

  render() {
    const latexCode = <LatexCode code={this.state.latexCode} />;
    const lines = [];
    for (let level = 5; level > -1; level -= 1) {
      const cell = [];
      for (let levelCell = 1; levelCell < 82; levelCell += 1) {
        // let position = level.toString() + levelCell.toString();
        switch (level) {
          case 0:
            if (levelCell < 2) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 1:
            if (levelCell < 4) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 2:
            if (levelCell < 10) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 3:
            if (levelCell < 28) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 4:
            if (levelCell < 82) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          default:
            break;
        }
      }
      lines.push(
        <div key={level} className="sequence-level">
          <br />
          {cell}
        </div>,
      );
    }
    return (
      <div className="sequence-container">
        <div className="sequence-button-symbols-container">
          <Symbols />
          <button
            className="basic-button sequence-reset-button"
            type="text"
            onClick={SequenceMath.resetApplicationState}
          >
            Reset sequence{' '}
          </button>
        </div>
        <hr className="sequence-separating-line" />
        {lines}
        {latexCode}
      </div>
    );
  }
}

export default SequenceMath;
