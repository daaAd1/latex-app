import React from 'react';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import LatexCode from '../UI/LatexCode';
import Symbols from '../UI/Symbols';
import SequenceMathLine from './SequenceMathLine';
import ProjectName from '../UI/ProjectName';
import { db } from '../../firebase';

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
    for (let key = 0; key < localStorage.length; key += 1) {
      if (localStorage.key(key).includes('math') || localStorage.key(key).includes('Math')) {
        localStorage.removeItem(localStorage.key(key));
        return SequenceMath.resetApplicationState();
      }
    }
    window.location.reload();
  }

  static getInitialWorkId() {
    return localStorage.getItem('math-work-id') || 0;
  }

  static getInitialProjectName() {
    return localStorage.getItem('Math-project-name') || 'Math project';
  }

  static getInitialWorkSaved() {
    let workSaved = localStorage.getItem('math-work-saved') || true;
    if (workSaved === 'false') {
      workSaved = false;
    } else {
      workSaved = true;
    }
    return workSaved;
  }

  static getInitialWorkSavedLimitOvereached() {
    let limitOvereached = localStorage.getItem('math-work-saved-limit-overeached') || false;
    if (limitOvereached === 'true') {
      limitOvereached = true;
    } else {
      limitOvereached = false;
    }
    return limitOvereached;
  }

  constructor(props) {
    super(props);
    this.state = {
      linesLength: this.getInitialLinesObject(),
      linesText: this.getInitialTextObject(),
      annotations: this.getInitialAnnotations(),
      projectName: SequenceMath.getInitialProjectName(),
      latexCode: '',
      isSignedIn: false,
      userUid: '',
      workId: SequenceMath.getInitialWorkId(),
      workSaved: SequenceMath.getInitialWorkSaved(),
      workSavedLimitOvereached: SequenceMath.getInitialWorkSavedLimitOvereached(),
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.lineClicked = this.lineClicked.bind(this);
    this.changeAnnotation = this.changeAnnotation.bind(this);
    this.changeProjectName = this.changeProjectName.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.addLineLengthToObject = this.addLineLengthToObject.bind(this);
    this.writeToFirebase = this.writeToFirebase.bind(this);
    this.saveSequence = this.saveSequence.bind(this);
  }

  openExistingDiagram() {
    if (this.props.location !== undefined && this.props.location.state !== undefined) {
      const { key } = this.props.location.state;
      db.onceGetWorks(this.state.userUid).then((snapshot) => {
        const data = snapshot.val()[key];
        localStorage.setItem('math-work-id', key);
        localStorage.setItem('Math-project-name', data.projectName);
        localStorage.setItem('math-line-object', JSON.stringify(JSON.parse(data.linesLength)));
        localStorage.setItem('math-text-object', JSON.stringify(JSON.parse(data.linesText)));
        localStorage.setItem(
          'math-annotation-object',
          JSON.stringify(JSON.parse(data.annotations)),
        );

        this.setState(
          {
            projectName: data.projectName,
            linesLength: JSON.parse(data.linesLength),
            linesText: JSON.parse(data.linesText),
            annotations: JSON.parse(data.annotations),
            workId: key,
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(),
            });
          },
        );
      });
    }
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isSignedIn: !!user, userUid: user.uid }, () => this.openExistingDiagram());
      }
    });

    this.setState(
      {
        linesText: this.generateTextObject(),
        annotations: this.generateAnnotations(),
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
  }

  getInitialLinesObject() {
    return JSON.parse(localStorage.getItem('math-line-object')) || this.createLinesLengthObject();
  }

  getInitialTextObject() {
    return JSON.parse(localStorage.getItem('math-text-object')) || this.generateTextObject();
  }

  getInitialAnnotations() {
    return JSON.parse(localStorage.getItem('math-annotation-object')) || this.generateAnnotations();
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

  addLineLengthToObject(level, levelCell, length) {
    const key = level.toString() + levelCell.toString();
    const obj = this.state.linesLength;
    obj[key] = length;
    this.setState(
      {
        linesLength: obj,
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
      if (snapshot.val() !== null && Number(snapshot.val().newWorkCount) > 14) {
        localStorage.setItem('math-work-saved-limit-overeached', true);
        this.setState({
          workSavedLimitOvereached: true,
        });
      } else {
        localStorage.setItem('math-work-saved-limit-overeached', false);
        this.setState({
          workSavedLimitOvereached: false,
        });
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
      }
    });
  }

  writeToFirebase(workId) {
    db.writeMathToDatabase(
      this.state.userUid,
      workId,
      this.state.projectName,
      'math',
      this.state.linesLength,
      this.state.linesText,
      this.state.annotations,
    ).then(() => {
      localStorage.setItem('math-work-saved', true);
      this.setState({
        workSaved: true,
      });
    });
  }

  saveSequence() {
    if (this.state.isSignedIn) {
      localStorage.setItem('math-work-saved', false);
      this.setState({
        workSaved: false,
      });
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
        //const positionOfTextBefore = (level - 1).toString() + (levelCell / 3).toString();
        //const positionOfTextTwoBefore = (level - 1).toString() + ((levelCell + 1) / 3).toString();
        //const positionOfTextThreeBefore = (level - 1).toString() + ((levelCell + 2) / 3).toString();
        if (
          levelCell <= Math.pow(3, level) / 3 &&
          this.state !== undefined &&
          this.state.annotations[position] !== '' &&
          this.state.annotations[position] !== undefined
        ) {
          if (
            this.state.linesLength[position] > 0 &&
            this.state.linesText[positionOfText] === '' &&
            this.state.linesText[positionOfTextTwo] === '' &&
            this.state.linesText[positionOfTextThree] === ''
          ) {
            row = '     &#92;AxiomC{}';
            middleCode.push(row);
          }
          row = `     &#92;RightLabel{&#92;scriptsize(${this.state.annotations[position]})}`;
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
            const numberOfNodes = this.state.linesLength[position];
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
        //const positionOfTextBefore = (level - 1).toString() + (levelCell / 3).toString();
        //const positionOfTextTwoBefore = (level - 1).toString() + ((levelCell + 1) / 3).toString();
        //const positionOfTextThreeBefore = (level - 1).toString() + ((levelCell + 2) / 3).toString();
        if (
          levelCell > Math.pow(3, level) / 3 &&
          levelCell <= (Math.pow(3, level) * 2) / 3 &&
          this.state !== undefined &&
          this.state.annotations[position] !== '' &&
          this.state.annotations[position] !== undefined
        ) {
          if (
            this.state.linesLength[position] > 0 &&
            this.state.linesText[positionOfText] === '' &&
            this.state.linesText[positionOfTextTwo] === '' &&
            this.state.linesText[positionOfTextThree] === ''
          ) {
            row = '     &#92;AxiomC{}';
            middleCode.push(row);
          }
          row = `     &#92;RightLabel{&#92;scriptsize(${this.state.annotations[position]}}`;
          middleCode.push(row);
          row = '';
        }

        if (
          levelCell > Math.pow(3, level) / 3 &&
          levelCell <= (Math.pow(3, level) * 2) / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            const numberOfNodes = this.state.linesLength[position];
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
        //const positionOfTextBefore = (level - 1).toString() + (levelCell / 3).toString();
        //const positionOfTextTwoBefore = (level - 1).toString() + ((levelCell + 1) / 3).toString();
        //const positionOfTextThreeBefore = (level - 1).toString() + ((levelCell + 2) / 3).toString();
        if (
          levelCell > (Math.pow(3, level) * 2) / 3 &&
          this.state !== undefined &&
          this.state.annotations[position] !== '' &&
          this.state.annotations[position] !== undefined
        ) {
          if (
            this.state.linesLength[position] > 0 &&
            this.state.linesText[positionOfText] === '' &&
            this.state.linesText[positionOfTextTwo] === '' &&
            this.state.linesText[positionOfTextThree] === ''
          ) {
            row = '     &#92;AxiomC{}';
            middleCode.push(row);
          }
          row = `     &#92;RightLabel{&#92;scriptsize(${this.state.annotations[position]})}`;
          middleCode.push(row);
          row = '';
        }
        if (
          levelCell > (Math.pow(3, level) * 2) / 3 &&
          this.state !== undefined &&
          this.state.linesText[position] !== '' &&
          this.state.linesText[position] !== undefined
        ) {
          if (level === 4) {
            row = `      &#92;AxiomC{${this.state.linesText[position]}}`;
          } else {
            const numberOfNodes = this.state.linesLength[position];
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

  createLinesLengthObject() {
    let initialObject;
    if (this.state !== undefined && this.state.linesObject !== undefined) {
      initialObject = this.state.linesLength;
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
            this.state.linesLength !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.linesLength[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 1 && levelCell < 4) {
          if (
            this.state !== undefined &&
            this.state.linesLength !== undefined &&
            this.state.lines[position] !== undefined
          ) {
            initialObject[position] = this.state.linesLength[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 2 && levelCell < 10) {
          if (
            this.state !== undefined &&
            this.state.linesLength !== undefined &&
            this.state.linesLength[position] !== undefined
          ) {
            initialObject[position] = this.state.linesLength[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 3 && levelCell < 28) {
          if (
            this.state !== undefined &&
            this.state.linesLength !== undefined &&
            this.state.linesLength[position] !== undefined
          ) {
            initialObject[position] = this.state.linesLength[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 4) {
          if (
            this.state !== undefined &&
            this.state.linesLength !== undefined &&
            this.state.linesLength[position] !== undefined
          ) {
            initialObject[position] = this.state.linesLength[position];
          } else {
            initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  generateAnnotations() {
    let initialObject;
    if (this.state !== undefined && this.state.annotations !== undefined) {
      initialObject = this.state.annotations;
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
            this.state.annotations !== undefined &&
            this.state.annotations[position] !== undefined
          ) {
            initialObject[position] = this.state.annotations[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 1 && levelCell < 4) {
          if (
            this.state !== undefined &&
            this.state.annotations !== undefined &&
            this.state.annotations[position] !== undefined
          ) {
            initialObject[position] = this.state.annotations[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 2 && levelCell < 10) {
          if (
            this.state !== undefined &&
            this.state.annotations !== undefined &&
            this.state.annotations[position] !== undefined
          ) {
            initialObject[position] = this.state.annotations[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 3 && levelCell < 28) {
          if (
            this.state !== undefined &&
            this.state.annotations !== undefined &&
            this.state.annotations[position] !== undefined
          ) {
            initialObject[position] = this.state.annotations[position];
          } else {
            initialObject[position] = '';
          }
        } else if (level === 4) {
          if (
            this.state !== undefined &&
            this.state.annotations !== undefined &&
            this.state.annotations[position] !== undefined
          ) {
            initialObject[position] = this.state.annotations[position];
          } else {
            initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  changeAnnotation(level, cell, newAnnotationText) {
    const key = level.toString() + cell.toString();
    const obj = this.state.annotations;
    obj[key] = newAnnotationText;
    this.setState(
      {
        annotations: obj,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
    localStorage.setItem('math-annotation-object', JSON.stringify(obj));
  }

  lineClicked(level, cell, length) {
    this.addLineLengthToObject(level, cell, length);
  }

  pushCell(level, cell) {
    const boolTrue = true;
    const boolFalse = false;
    const position = level.toString() + cell.toString();
    let positionOneLevelDown = (level - 1).toString() + (cell / 2).toString();
    let levelNotHighEnough = false;

    if ((cell + 2) % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + ((cell + 2) / 3).toString();
      if (this.state.linesLength[positionOneLevelDown] < 1) {
        levelNotHighEnough = true;
      }
    } else if ((cell + 1) % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + ((cell + 1) / 3).toString();
      if (this.state.linesLength[positionOneLevelDown] < 2) {
        levelNotHighEnough = true;
      }
    } else if (cell % 3 === 0) {
      positionOneLevelDown = (level - 1).toString() + (cell / 3).toString();
      if (this.state.linesLength[positionOneLevelDown] < 3) {
        levelNotHighEnough = true;
      }
    }
    let readonlyText = true;
    if (this.state.linesText[positionOneLevelDown] !== '') {
      readonlyText = false;
    }
    //const positionChildrenOne = (level + 1).toString() + (cell * 3).toString();
    //const positionChildrenTwo = (level + 1).toString() + (cell * 3 - 1).toString();
    //const positionChildrenThree = (level + 1).toString() + (cell * 3 - 2).toString();

    let annotationText = '';
    if (this.state !== undefined && this.state.annotations !== undefined) {
      annotationText = this.state.annotations[position];
    }
    const inputText = this.state.linesText[position];
    const length = Number(this.state.linesLength[position]);
    let annotation = false;
    if (this.state.linesLength[position] > 0) {
      annotation = true;
    }

    if (!levelNotHighEnough && this.state !== null && this.state.linesLength[position] > 0) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            changedText={this.addTextToObject}
            white={boolFalse}
            inputText={inputText}
            length={length}
            level={level}
            cell={cell}
            onClick={(length) => this.lineClicked(level, cell, length)}
            annotationChanged={this.changeAnnotation}
            annotationText={annotationText}
            annotation={annotation}
            clicked
            readonlyText={readonlyText}
          />
        </div>
      );
    } else if (
      !levelNotHighEnough &&
      this.state !== null &&
      this.state.linesLength[positionOneLevelDown] > 0
    ) {
      return (
        <div key={position} className="sequence-level-cells">
          <SequenceMathLine
            changedText={this.addTextToObject}
            white={boolFalse}
            level={level}
            cell={cell}
            inputText={inputText}
            length={length}
            annotation={annotation}
            onClick={(length) => this.lineClicked(level, cell, length)}
            annotationChanged={this.changeAnnotation}
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
            inputText={inputText}
            length={length}
            annotation={annotation}
            onClick={(length) => this.lineClicked(level, cell, length)}
            annotationChanged={this.changeAnnotation}
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

  changeProjectName(changedName) {
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
    const { projectName } = this.state;
    let workSavedElement;
    if (this.state.workSavedLimitOvereached) {
      workSavedElement = <p className="work-saved-limit">You have already saved 15 works</p>;
    } else if (this.state.workSaved) {
      workSavedElement = <p>Work saved</p>;
    } else {
      workSavedElement = <div className="loader">Saving...</div>;
    }
    if (
      !this.state.isSignedIn ||
      (localStorage.getItem('math-work-saved') === null &&
        localStorage.getItem('math-work-saved-limit-overeached') == null)
    ) {
      workSavedElement = '';
    }
    return (
      <div className="sequence-container">
        <div className="sequence-button-symbols-container">
          <div className="sequence-name-work-container">
            <ProjectName
              name={projectName}
              type="Math"
              projectNameChanged={this.changeProjectName}
            />
            <div className="work-saved-container">{workSavedElement}</div>
          </div>
          <Symbols />
          <button
            className="basic-button sequence-reset-button"
            type="text"
            onClick={SequenceMath.resetApplicationState}
          >
            Start new sequence
          </button>
        </div>
        <hr className="sequence-separating-line" />
        {lines}
        {latexCode}
      </div>
    );
  }
}

SequenceMath.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      key: PropTypes.string,
    }),
  }),
};

SequenceMath.defaultProps = {
  location: {},
};

export default withRouter(SequenceMath);
