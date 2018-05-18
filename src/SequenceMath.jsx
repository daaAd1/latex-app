import React from 'react';
import * as firebase from 'firebase';
import LatexCode from './LatexCode';
import Symbols from './Symbols';
import SequenceMathLine from './SequenceMathLine';
import ProjectName from './ProjectName';
import { db } from './firebase';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: SequenceMath
**
*/

/*
Hlavný komponent pri sekventových dôkazoch. Pozostáva hlavne z komponentov SequenceMathLine
a z reset tlačidla a zoznamu používaných symbolov.
*/

/*
Tento komponent dostáva dáta od svojich potomkov, následne ich ukladá a potom generuje a posiela 
do komponentu LatexCode, ktorý ich zobrazí.
Po zmene textu dôkazu, komponent SequenceMathLine odošle level aj stĺpec dôkazu spolu s novým textom.
Tento komponent informácie prijme a pomocou funkcie addTextToObject ich pridá do objektu linesText.
Potom vygeneruje funkcia generateLatexCode nový LaTeX kód a tento kód odošle komponentu LatexCode.
*/

/*  global localStorage: false, console: false, window: false */

class SequenceMath extends React.Component {
  static resetApplicationState() {
    window.localStorage.clear();
    window.location.reload();
  }

  static getInitialWorkId() {
    const workId = localStorage.getItem('math-work-id') || 0;
    return workId;
  }

  static getInitialProjectName() {
    const projectName = localStorage.getItem('Math-project-name') || 'Math project';
    return projectName;
  }

  constructor(props) {
    super(props);
    this.state = {
      lines: this.getInitialLinesObject(),
      linesText: this.getInitialTextObject(),
      latexCode: '',
      annotationObject: this.getInitialAnnotationObject(),
      projectName: SequenceMath.getInitialProjectName(),
      workId: SequenceMath.getInitialWorkId(),
      isSignedIn: false,
      userUid: '',
    };

    this.lineClick = this.lineClick.bind(this);
    this.generateLinesObject = this.generateLinesObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
    this.addLineToObject = this.addLineToObject.bind(this);
    this.writeToFirebase = this.writeToFirebase.bind(this);
    this.projectNameChanged = this.projectNameChanged.bind(this);
    this.saveSequence = this.saveSequence.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user, userUid: user.uid });
    });

    this.setState(
      {
        linesText: this.generateTextObject(),
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

  updateWorkCount() {
    let workCount = 0;
    db.onceGetWorkCount(this.state.userUid).then((snapshot) => {
      if (snapshot.val() === null) {
        workCount = 1;
      } else {
        workCount = Number(snapshot.val().newWorkCount) + 1;
      }
      db.writeToWorkCount(this.state.userUid, workCount);
      this.setState({
        workId: workCount,
      });
      localStorage.setItem('math-work-id', Number(workCount));
      this.writeToFirebase(workCount);
    });
  }

  writeToFirebase(workId) {
    db.writeMathToDatabase(
      this.state.userUid,
      workId,
      this.state.projectName,
      'math',
      this.state.lines,
      this.state.linesText,
      this.state.annotationObject,
    );
  }

  saveSequence() {
    if (this.state.isSignedIn) {
      if (this.state.workId === 0) {
        this.updateWorkCount();
      } else {
        this.writeToFirebase(this.state.workId);
      }
    }
  }

  generateLatexCode() {
    this.saveSequence();
    const beginCode = [' &#92;begin{prooftree}'];
    const endCode = [' &#92;end{prooftree}'];
    const middleCode = [];

    for (let level = 4; level > 0; level -= 1) {
      for (let levelCell = 1; levelCell < 28; levelCell += 1) {
        let row = '';
        const position = level.toString() + levelCell.toString();
        const positionOfText = (level + 1).toString() + (levelCell * 3).toString();
        const positionOfTextTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
        const positionOfTextThree = (level + 1).toString() + (levelCell * 3 - 2).toString();
        const positionOfTextBefore = (level - 1).toString() + (levelCell / 3).toString();
        const positionOfTextTwoBefore = (level - 1).toString() + ((levelCell + 1) / 3).toString();
        const positionOfTextThreeBefore = (level - 1).toString() + ((levelCell + 2) / 3).toString();
        if (
          levelCell <= Math.pow(3, level) / 3 &&
          this.state !== undefined &&
          this.state.annotationObject[position] !== '' &&
          this.state.annotationObject[position] !== undefined
        ) {
          if (
            this.state.lines[position] > 0 &&
            this.state.linesText[positionOfText] === '' &&
            this.state.linesText[positionOfTextTwo] === '' &&
            this.state.linesText[positionOfTextThree] === ''
          ) {
            row = '     &#92;AxiomC{}';
            middleCode.push(row);
          }
          row = `     &#92;RightLabel{&#92;scriptsize(${this.state.annotationObject[position]})}`;
          middleCode.push(row);
          row = '';
        }

        if (
          levelCell <= Math.pow(3, level) / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            let numberOfNodes = this.state.lines[position];
            if (numberOfNodes < 1) {
              row = `     &#92;AxiomC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 1) {
              row = `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 2) {
              row = `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 3) {
              row = `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
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
        const positionOfText = (level + 1).toString() + (levelCell * 3).toString();
        const positionOfTextTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
        const positionOfTextThree = (level + 1).toString() + (levelCell * 3 - 2).toString();
        const positionOfTextBefore = (level - 1).toString() + (levelCell / 3).toString();
        const positionOfTextTwoBefore = (level - 1).toString() + ((levelCell + 1) / 3).toString();
        const positionOfTextThreeBefore = (level - 1).toString() + ((levelCell + 2) / 3).toString();
        if (
          levelCell > Math.pow(3, level) / 3 &&
          levelCell <= Math.pow(3, level) * 2 / 3 &&
          this.state !== undefined &&
          this.state.annotationObject[position] !== '' &&
          this.state.annotationObject[position] !== undefined
        ) {
          if (
            this.state.lines[position] > 0 &&
            this.state.linesText[positionOfText] === '' &&
            this.state.linesText[positionOfTextTwo] === '' &&
            this.state.linesText[positionOfTextThree] === ''
          ) {
            row = '     &#92;AxiomC{}';
            middleCode.push(row);
          }
          row = `     &#92;RightLabel{&#92;scriptsize(${this.state.annotationObject[position]}}`;
          middleCode.push(row);
          row = '';
        }

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
            let numberOfNodes = this.state.lines[position];
            if (numberOfNodes < 1) {
              row = `     &#92;AxiomC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 1) {
              row = `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 2) {
              row = `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 3) {
              row = `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
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
        const positionOfText = (level + 1).toString() + (levelCell * 3).toString();
        const positionOfTextTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
        const positionOfTextThree = (level + 1).toString() + (levelCell * 3 - 2).toString();
        const positionOfTextBefore = (level - 1).toString() + (levelCell / 3).toString();
        const positionOfTextTwoBefore = (level - 1).toString() + ((levelCell + 1) / 3).toString();
        const positionOfTextThreeBefore = (level - 1).toString() + ((levelCell + 2) / 3).toString();
        if (
          levelCell > Math.pow(3, level) * 2 / 3 &&
          this.state !== undefined &&
          this.state.annotationObject[position] !== '' &&
          this.state.annotationObject[position] !== undefined
        ) {
          if (
            this.state.lines[position] > 0 &&
            this.state.linesText[positionOfText] === '' &&
            this.state.linesText[positionOfTextTwo] === '' &&
            this.state.linesText[positionOfTextThree] === ''
          ) {
            row = '     &#92;AxiomC{}';
            middleCode.push(row);
          }
          row = `     &#92;RightLabel{&#92;scriptsize(${this.state.annotationObject[position]})}`;
          middleCode.push(row);
          row = '';
        }
        if (
          levelCell > Math.pow(3, level) * 2 / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            let numberOfNodes = this.state.lines[position];
            if (numberOfNodes < 1) {
              row = `     &#92;AxiomC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 1) {
              row = `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 2) {
              row = `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
            } else if (numberOfNodes === 3) {
              row = `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
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
      initialObject = this.state.lines;
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
            this.state.lines !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.lines[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 1 && levelCell < 4) {
          if (
            this.state !== undefined &&
            this.state.lines !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.lines[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 2 && levelCell < 10) {
          if (
            this.state !== undefined &&
            this.state.lines !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.lines[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 3 && levelCell < 28) {
          if (
            this.state !== undefined &&
            this.state.lines !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.lines[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 4) {
          if (
            this.state !== undefined &&
            this.state.lines !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.lines[position];
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
    let readonlyText = true;
    if (this.state.linesText[positionOneLevelDown] !== '') {
      readonlyText = false;
    }
    const positionChildrenOne = (level + 1).toString() + (cell * 3).toString();
    const positionChildrenTwo = (level + 1).toString() + (cell * 3 - 1).toString();
    const positionChildrenThree = (level + 1).toString() + (cell * 3 - 2).toString();

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
            onClick={(length) => this.lineClick(level, cell, length)}
            annotationChanged={this.annotationChanged}
            annotationText={annotationText}
            clicked
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
            onClick={(length) => this.lineClick(level, cell, length)}
            annotationChanged={this.annotationChanged}
            annotationText={annotationText}
            clicked={false}
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
            onClick={(length) => this.lineClick(level, cell, length)}
            annotationChanged={this.annotationChanged}
            annotationText={annotationText}
            clicked={false}
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

  projectNameChanged(changedName) {
    this.setState(
      {
        projectName: changedName,
      },
      () => {
        this.saveSequence();
      },
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
          <ProjectName type="Math" projectNameChanged={this.projectNameChanged} />
        </div>
        <hr className="sequence-separating-line" />
        {lines}
        {latexCode}
      </div>
    );
  }
}

export default SequenceMath;
