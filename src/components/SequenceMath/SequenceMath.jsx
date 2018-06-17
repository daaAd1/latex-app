import React from 'react';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import LatexCode from '../UI/LatexCode';
import Symbols from '../UI/Symbols';
import SequenceMathCells from './SequenceMathCells';
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
Po zmene textu dôkazu, komponent SequenceMathLine odošle level
aj stĺpec dôkazu spolu s novým textom.
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

  static getInitialLinesObject() {
    return JSON.parse(localStorage.getItem('math-line-object')) || {};
  }

  static getInitialTextObject() {
    return JSON.parse(localStorage.getItem('math-text-object')) || {};
  }

  static getInitialAnnotations() {
    return JSON.parse(localStorage.getItem('math-annotation-object')) || {};
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

  static checkCellBoundaryForFirstThird(level, cell) {
    return cell <= Math.pow(3, level) / 3;
  }

  static checkCellBoundaryForSecondThird(level, cell) {
    return cell > Math.pow(3, level) / 3 && cell <= (Math.pow(3, level) * 2) / 3;
  }

  static checkCellBoundaryForLastThird(level, cell) {
    return cell > (Math.pow(3, level) * 2) / 3;
  }

  static isCellWithinReach(third, level, levelCell) {
    if (third === 'first') {
      return SequenceMath.checkCellBoundaryForFirstThird(level, levelCell);
    } else if (third === 'second') {
      return SequenceMath.checkCellBoundaryForSecondThird(level, levelCell);
    }
    return SequenceMath.checkCellBoundaryForLastThird(level, levelCell);
  }

  static isLevelLast(level) {
    return level === 4;
  }

  static addNewlineToStringIfEmpty(string) {
    if (string.length > 0) {
      return `${string}\n`;
    }
    return string;
  }

  constructor(props) {
    super(props);
    this.state = {
      linesLength: SequenceMath.getInitialLinesObject(),
      linesText: SequenceMath.getInitialTextObject(),
      annotations: SequenceMath.getInitialAnnotations(),
      projectName: SequenceMath.getInitialProjectName(),
      latexCode: '',
      isSignedIn: false,
      userUid: '',
      workId: SequenceMath.getInitialWorkId(),
      workSaved: SequenceMath.getInitialWorkSaved(),
      workSavedLimitOvereached: SequenceMath.getInitialWorkSavedLimitOvereached(),
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleLineLengthChange = this.handleLineLengthChange.bind(this);
    this.handleAnnotationChange = this.handleAnnotationChange.bind(this);
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
    this.saveSequenceToDatabase = this.saveSequenceToDatabase.bind(this);
    this.writeToFirebase = this.writeToFirebase.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isSignedIn: !!user, userUid: user.uid }, () => this.openExistingDiagram());
      }
    });

    this.setState({
      latexCode: this.generateLatexCode(),
    });
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

  generateLatexCode() {
    this.saveSequenceToDatabase();

    const beginCode = [' &#92;begin{prooftree}'];
    const middleCode = this.generateMiddleCode();
    const endCode = [' &#92;end{prooftree}'];

    return [beginCode, middleCode, endCode].join('\n');
  }

  saveSequenceToDatabase() {
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

  generateMiddleCode() {
    return `${this.checkCellsInFirstPart()}${this.checkCellsInSecondPart()}${this.checkCellsInThirdPart()}`;
  }

  checkCellsInFirstPart() {
    const maxCellNumber = 27;
    const text = this.checkCellsForText('first', maxCellNumber);
    return SequenceMath.addNewlineToStringIfEmpty(text);
  }

  checkCellsForText(whichThird, maxLevelCell) {
    const middleCode = [];

    if (this.state !== undefined) {
      for (let level = 4; level > -1; level -= 1) {
        for (let levelCell = 0; levelCell < maxLevelCell; levelCell += 1) {
          let row = '';
          const position = level.toString() + levelCell.toString();
          const childOne = (level + 1).toString() + (levelCell * 3 - 2).toString();
          const childTwo = (level + 1).toString() + (levelCell * 3 - 1).toString();
          const childThree = (level + 1).toString() + (levelCell * 3).toString();

          if (SequenceMath.isCellWithinReach(whichThird, level, levelCell)) {
            if (this.isAnnotationObjectDefinedAndNotEmpty(position)) {
              row += this.returnAnnotationText(position, childOne, childTwo, childThree);
            }

            if (this.isTextObjectDefinedAndNotEmpty(position)) {
              row += this.returnRowText(position, level);
            }

            if (row !== '') {
              middleCode.push(row);
            }
          }
        }
      }
    }

    return middleCode.join('\n');
  }

  isAnnotationObjectDefinedAndNotEmpty(position) {
    return (
      this.state.annotations !== undefined &&
      this.state.annotations[position] !== undefined &&
      this.state.annotations[position] !== ''
    );
  }

  returnAnnotationText(position, childOne, childTwo, childThree) {
    if (
      this.doesNodeHaveChildrenAndAreNodeChildrenEmpty(position, childOne, childTwo, childThree)
    ) {
      return `     &#92;AxiomC{}\n     &#92;RightLabel{&#92;scriptsize(${
        this.state.annotations[position]
      })}\n`;
    }
    return `     &#92;RightLabel{&#92;scriptsize(${this.state.annotations[position]})}\n`;
  }

  doesNodeHaveChildrenAndAreNodeChildrenEmpty(position, childOne, childTwo, childThree) {
    return (
      this.state.linesLength[position] > 0 &&
      (this.state.linesText[childOne] === undefined || this.state.linesText[childOne] === '') &&
      (this.state.linesText[childTwo] === undefined || this.state.linesText[childTwo] === '') &&
      (this.state.linesText[childThree] === undefined || this.state.linesText[childThree] === '')
    );
  }

  isTextObjectDefinedAndNotEmpty(position) {
    return (
      this.state.linesText !== undefined &&
      this.state.linesText[position] !== undefined &&
      this.state.linesText[position] !== ''
    );
  }

  returnRowText(position, level) {
    if (SequenceMath.isLevelLast(level)) {
      return `     &#92;AxiomC{${this.state.linesText[position]}}`;
    }
    return this.checkNodeChildrenAndReturnRowText(position);
  }

  checkNodeChildrenAndReturnRowText(position) {
    const numberOfNodes = this.state.linesLength[position];
    if (numberOfNodes === 1) {
      return `     &#92;UnaryInfC{${this.state.linesText[position]}}`;
    } else if (numberOfNodes === 2) {
      return `     &#92;BinaryInfC{${this.state.linesText[position]}}`;
    } else if (numberOfNodes === 3) {
      return `     &#92;TrinaryInfC{${this.state.linesText[position]}}`;
    }
    return `     &#92;AxiomC{${this.state.linesText[position]}}`;
  }

  checkCellsInSecondPart() {
    const maxCellNumber = 55;
    const text = this.checkCellsForText('second', maxCellNumber);
    return SequenceMath.addNewlineToStringIfEmpty(text);
  }

  checkCellsInThirdPart() {
    const maxCellNumber = 81;
    return this.checkCellsForText('third', maxCellNumber);
  }

  handleTextChange(level, cell, text) {
    const key = level.toString() + cell.toString();
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

  handleLineLengthChange(level, cell, length) {
    const key = level.toString() + cell.toString();
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

  handleAnnotationChange(level, cell, newAnnotationText) {
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

  handleProjectNameChange(changedName) {
    localStorage.setItem('Math-project-name', changedName);
    this.setState(
      {
        projectName: changedName,
      },
      () => {
        this.saveSequenceToDatabase();
      },
    );
  }

  render() {
    const latexCode = <LatexCode code={this.state.latexCode} />;

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
              projectNameChanged={this.handleProjectNameChange}
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
        <SequenceMathCells
          linesText={this.state.linesText}
          annotations={this.state.annotations}
          linesLength={this.state.linesLength}
          onTextChange={this.handleTextChange}
          onLineLengthChange={(level, cell, length) =>
            this.handleLineLengthChange(level, cell, length)
          }
          onAnnotationChange={this.handleAnnotationChange}
        />
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
