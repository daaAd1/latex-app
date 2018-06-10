import React from 'react';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import LatexCode from '../UI/LatexCode';
import Symbols from '../UI/Symbols';
import TaylorRow from './TaylorRow';
import ProjectName from '../UI/ProjectName';
import { db } from '../../firebase';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TaylorDiagram
**
*/

/*
Hlavný komponent časti Taylorovych diagramov. Komponent pozostáva hlavne z komponentu TaylorRow
a zo všeobecných komponentov Symbols a LatexCode.
*/

/*
Tento komponent dostáva od komponentu TaylorRow dáta, ako sú text v jednotlivých bunkách,
aktívne šípky, texty pri šípkach a typy šípiek. Taktiež dostáva informácie o
veľkosti/dĺžke jednotlivých riadkov. Tieto informácie si potom ukladá a
generuje nový LaTeX kód pomocou funkcie generateLatexCode, ktorý pošle komponentu
LatexCode, ktorý ho zobrazí.
*/

/*  global localStorage: false, console: false, window: false */

class TaylorDiagram extends React.PureComponent {
  static removeTaylorFromLocalStorage() {
    for (let key = 0; key < localStorage.length; key += 1) {
      if (localStorage.key(key).includes('taylor') || localStorage.key(key).includes('Taylor')) {
        localStorage.removeItem(localStorage.key(key));
        return TaylorDiagram.removeTaylorFromLocalStorage();
      }
    }
    return window.location.reload();
  }

  static checkRowsValue(rows) {
    if (rows < 1) {
      return 1;
    } else if (rows > 15) {
      return 15;
    }
    return rows;
  }

  static getInitialRows() {
    return Number(localStorage.getItem('taylor-rows') || 2);
  }

  static initializeAdditionalArrowsObject() {
    const arrowObject = {};
    for (let row = 1; row < 10; row += 1) {
      const position = row.toString();
      arrowObject[position] = false;
    }
    return arrowObject;
  }

  static getInitialWorkId() {
    return localStorage.getItem('taylor-work-id') || 0;
  }

  static getInitialProjectName() {
    return localStorage.getItem('Taylor-project-name') || 'Taylor project';
  }

  static getInitialWorkSaved() {
    let workSaved = localStorage.getItem('taylor-work-saved') || true;
    if (workSaved === 'false') {
      workSaved = false;
    } else {
      workSaved = true;
    }
    return workSaved;
  }

  static getInitialAdditionalArrowsObject() {
    return (
      JSON.parse(localStorage.getItem('taylor-additional-arrow-object')) ||
      TaylorDiagram.initializeAdditionalArrowsObject()
    );
  }

  static setLocalStorageRows(rows) {
    localStorage.setItem('taylor-rows', rows);
  }

  static setLocalStorageColumns(obj) {
    localStorage.setItem('taylor-columns', obj);
  }

  static setLocalStorageTextObject(obj) {
    localStorage.setItem('taylor-text-object', obj);
  }

  static setLocalStorageArrowObject(obj) {
    localStorage.setItem('taylor-arrow-object', obj);
  }

  static getInitialWorkSavedLimitOvereached() {
    let limitOvereached = localStorage.getItem('taylor-work-saved-limit-overeached') || false;
    if (limitOvereached === 'true') {
      limitOvereached = true;
    } else {
      limitOvereached = false;
    }
    return limitOvereached;
  }

  static checkIfOnLastRow(currentRow, lastRow) {
    if (currentRow !== lastRow) {
      return ' &#92;&#92;';
    }
    return '';
  }

  static joinCodeParts(core) {
    const beginning = '&#92;begin{diagram}';
    const ending = '&#92;end{diagram}';
    return [beginning, core.join('\n'), ending].join('\n');
  }

  static isStringEmpty(string) {
    return string === '';
  }

  static isFirstColumn(column) {
    return column === 1;
  }

  static isEqualDirection(direction, wantedDirection) {
    return direction === wantedDirection;
  }

  static handleArrowOnFirstColumn(direction, type) {
    if (TaylorDiagram.isEqualDirection(direction, 'd')) {
      return ` &#92;${direction}${type}`;
    } else if (TaylorDiagram.isEqualDirection(direction, 'l')) {
      return '';
    }
    return TaylorDiagram.returnArrowWithAmpersand(direction, type);
  }

  static returnArrowWithAmpersand(direction, type) {
    return ` & &#92;${direction}${type}`;
  }

  static isLastColumn(column, totalColumns) {
    return column === totalColumns;
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: TaylorDiagram.getInitialRows(),
      projectName: TaylorDiagram.getInitialProjectName(),
      columnsObject: this.getInitialColumnsObject(),
      textsObject: this.getInitialTextsObject(),
      arrowsObject: this.getInitialArrowsObject(),
      additionalArrowsObject: TaylorDiagram.getInitialAdditionalArrowsObject(),
      latexCode: '',
      isSignedIn: false,
      userUid: '',
      workId: TaylorDiagram.getInitialWorkId(),
      workSaved: TaylorDiagram.getInitialWorkSaved(),
      workSavedLimitOvereached: TaylorDiagram.getInitialWorkSavedLimitOvereached(),
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.handleRowsChange = this.handleRowsChange.bind(this);
    this.handleColumnsChange = this.handleColumnsChange.bind(this);
    this.handleCellTextChange = this.handleCellTextChange.bind(this);
    this.changeProjectName = this.changeProjectName.bind(this);
    this.checkForArrow = this.checkForArrow.bind(this);
    this.checkArrowObjectForArrows = this.checkArrowObjectForArrows.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.addArrowToObject = this.addArrowToObject.bind(this);
    this.deleteArrowFromObject = this.deleteArrowFromObject.bind(this);
    this.setLatexCodeString = this.setLatexCodeString.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isSignedIn: !!user, userUid: user.uid }, () => this.openExistingDiagram());
      }
    });
    this.setState(
      {
        columnsObject: this.initializeColumnsObject(this.state.rows),
        textsObject: this.initializeTextsObject(this.state.rows, 10),
        arrowsObject: this.initializeArrowObject(this.state.rows, 10),
        additionalArrowsObject: TaylorDiagram.initializeAdditionalArrowsObject(),
      },
      () => this.setLatexCodeString(),
    );
  }

  setLatexCodeString() {
    this.setState({
      latexCode: this.generateLatexCode(),
    });
  }

  getInitialColumnsObject() {
    return JSON.parse(localStorage.getItem('taylor-columns')) || this.initializeColumnsObject(2);
  }

  getInitialTextsObject() {
    return (
      JSON.parse(localStorage.getItem('taylor-text-object')) || this.initializeTextsObject(2, 10)
    );
  }

  getInitialArrowsObject() {
    return (
      JSON.parse(localStorage.getItem('taylor-arrow-object')) || this.initializeArrowObject(2, 10)
    );
  }

  getNumberOfRows(defaultRows) {
    if (this.state !== undefined) {
      return this.state.rows;
    }
    return defaultRows;
  }

  getNumberOfColumns(defaultColumns, row) {
    if (this.state !== undefined && this.state.columnsObject !== undefined) {
      return this.state.columnsObject[row];
    }
    return defaultColumns;
  }

  openExistingDiagram() {
    if (this.props.location !== undefined && this.props.location.state !== undefined) {
      const { key } = this.props.location.state;
      db.onceGetWorks(this.state.userUid).then((snapshot) => {
        const data = snapshot.val()[key];
        localStorage.setItem('taylor-work-id', key);
        localStorage.setItem('taylor-rows', data.rows);
        localStorage.setItem('Taylor-project-name', data.projectName);
        localStorage.setItem('taylor-columns', JSON.stringify(JSON.parse(data.columnsObject)));
        localStorage.setItem('taylor-text-object', JSON.stringify(JSON.parse(data.textsObject)));
        localStorage.setItem('taylor-arrow-object', JSON.stringify(JSON.parse(data.arrowsObject)));

        this.setState(
          {
            rows: Number(data.rows),
            projectName: data.projectName,
            textsObject: JSON.parse(data.textsObject),
            columnsObject: JSON.parse(data.columnsObject),
            arrowsObject: JSON.parse(data.arrowsObject),
            workId: key,
          },
          () => {
            this.setState(
              {
                textsObject: this.initializeTextsObject(this.state.rows, 10),
                arrowsObject: this.initializeArrowObject(this.state.rows, 10),
              },
              () => {
                this.setState({
                  latexCode: this.generateLatexCode(this.state.rows),
                });
              },
            );
          },
        );
      });
    }
  }

  handleRowsChange(event) {
    const rows = TaylorDiagram.checkRowsValue(event.target.value);
    this.updateStatePropertiesAndLatexCode(rows);
    TaylorDiagram.setLocalStorageRows(rows);
  }

  updateStatePropertiesAndLatexCode(rows) {
    this.setState(
      {
        rows,
        textsObject: this.initializeTextsObject(rows, 10),
        columnsObject: this.initializeColumnsObject(rows),
        arrowsObject: this.initializeArrowObject(rows, 10),
      },
      () => {
        this.setLatexCodeString();
      },
    );
  }

  handleColumnsChange(row, columnsNewValue) {
    const key = row.toString();
    const obj = this.state.columnsObject;
    obj[key] = Number(columnsNewValue);
    this.setState(
      {
        columnsObject: obj,
      },
      () => this.setLatexCodeString(),
    );
    TaylorDiagram.setLocalStorageColumns(JSON.stringify(obj));
  }

  handleCellTextChange(text, row, column) {
    this.addTextToObject(text, row, column);
    this.setLatexCodeString();
  }

  addTextToObject(text, row, column) {
    const key = row.toString() + column.toString();
    const obj = this.state.textsObject;
    obj[key] = text;
    this.setState({
      textsObject: obj,
    });
    TaylorDiagram.setLocalStorageTextObject(JSON.stringify(obj));
  }

  initializeColumnsObject(rows) {
    let columnsObject;
    if (this.state !== undefined && this.state.columnsObject !== undefined) {
      ({ columnsObject } = this.state);
    } else {
      columnsObject = {};
    }
    for (let row = 1; row <= rows; row += 1) {
      const position = row.toString();
      if (
        this.state !== undefined &&
        this.state.columnsObject !== undefined &&
        this.state.columnsObject[position] !== undefined
      ) {
        columnsObject[position] = this.state.columnsObject[position];
      } else {
        columnsObject[position] = 3;
      }
    }
    return columnsObject;
  }

  initializeTextsObject(rows, maxColumns) {
    let textsObject;
    if (!this.isStateUndefined() && !this.isTextsObjectUndefined()) {
      ({ textsObject } = this.state);
    } else {
      textsObject = {};
    }
    for (let row = 1; row <= rows; row += 1) {
      for (let column = 1; column <= maxColumns; column += 1) {
        const position = row.toString() + column.toString();
        if (
          this.state !== undefined &&
          !this.isTextsObjectUndefined() &&
          this.state.textsObject[position] !== undefined
        ) {
          textsObject[position] = this.state.textsObject[position];
        } else {
          textsObject[position] = '';
        }
      }
    }
    return textsObject;
  }

  initializeArrowObject(rows, maxColumns) {
    let arrowObject;
    if (this.state !== undefined && this.state.arrowObject !== undefined) {
      ({ arrowObject } = this.state);
    } else {
      arrowObject = {};
    }
    for (let row = 1; row <= rows; row += 1) {
      for (let column = 1; column <= maxColumns; column += 1) {
        const position = row.toString() + column.toString();
        if (
          this.state !== undefined &&
          !this.isArrowsObjectUndefined() &&
          this.state.arrowsObject[position] !== undefined
        ) {
          arrowObject[position] = this.state.arrowsObject[position];
        } else {
          arrowObject[position] = {};
          arrowObject[position].lu = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].u = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].ru = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].l = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].r = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].ld = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].d = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
          arrowObject[position].rd = {
            active: false,
            text: '',
            text2: '',
            type: '',
          };
        }
      }
    }
    return arrowObject;
  }

  addArrowToObject(row, column, direction, text, text2, type) {
    const key = row.toString() + column.toString();
    const obj = this.state.arrowsObject;
    obj[key][direction].active = true;
    obj[key][direction].text = text;
    obj[key][direction].text2 = text2;
    obj[key][direction].type = type;

    this.setState(
      {
        arrowsObject: obj,
      },
      () => this.setLatexCodeString(),
    );
    TaylorDiagram.setLocalStorageArrowObject(JSON.stringify(obj));
  }

  deleteArrowFromObject(row, column, direction) {
    const key = row.toString() + column.toString();
    const obj = this.state.arrowsObject;
    obj[key][direction].active = false;
    this.setState(
      {
        arrowsObject: obj,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
        });
      },
    );
    TaylorDiagram.setLocalStorageArrowObject(JSON.stringify(obj));
  }

  updateWorkCount() {
    let workCount = 0;
    db.onceGetWorkCount(this.state.userUid).then((snapshot) => {
      if (snapshot.val() !== null && Number(snapshot.val().newWorkCount) > 14) {
        localStorage.setItem('taylor-work-saved-limit-overeached', true);
        this.setState({
          workSavedLimitOvereached: true,
        });
      } else {
        localStorage.setItem('taylor-work-saved-limit-overeached', false);
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
        localStorage.setItem('taylor-work-id', Number(workCount));
        this.writeToFirebase(workCount);
      }
    });
  }

  writeToFirebase(workId) {
    db.writeDiagramToDatabase(
      this.state.userUid,
      workId,
      this.state.projectName,
      'taylor',
      this.state.rows,
      this.state.textsObject,
      this.state.columnsObject,
      this.state.arrowsObject,
      this.state.additionalArrowsObject,
    ).then(() => {
      localStorage.setItem('taylor-work-saved', true);
      this.setState({
        workSaved: true,
      });
    });
  }

  saveTaylorToDatabase() {
    if (this.state.isSignedIn) {
      localStorage.setItem('taylor-work-saved', false);
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

  generateLatexCode(rows) {
    this.checkArrowObjectForArrows();
    this.saveTaylorToDatabase();

    const numOfRows = this.getNumberOfRows(rows);
    const corePart = this.generateCoreCode(numOfRows);

    return TaylorDiagram.joinCodeParts(corePart);
  }

  isStateUndefined() {
    return this.state === undefined;
  }

  isArrowsObjectUndefined() {
    return this.state.arrowsObject === undefined;
  }

  isTextsObjectUndefined() {
    return this.state.textsObject === undefined;
  }

  isAdditionalArrowsObjectUndefined() {
    return this.state.additionalArrowsObject === undefined;
  }

  isArrowObjectOnPositionUndefined(position) {
    return this.state.arrowsObject[position] === undefined;
  }

  isArrowWithDirectionUndefined(position, direction) {
    return this.state.arrowsObject[position][direction] === undefined;
  }

  isArrowActive(position, direction) {
    return this.state.arrowsObject[position][direction].active;
  }

  isGeneratingCodeOnRowPossible(position) {
    return (
      !this.isStateUndefined() &&
      !this.isArrowsObjectUndefined() &&
      !this.isArrowObjectOnPositionUndefined(position) &&
      !this.isTextsObjectUndefined()
    );
  }

  checkForArrow(position, direction, column) {
    if (this.isArrowDefinedAndActive(position, direction)) {
      return this.createArrowString(position, direction, column);
    }
    return '';
  }

  isArrowDefinedAndActive(position, direction) {
    return (
      !this.isArrowObjectOnPositionUndefined(position) &&
      !this.isArrowWithDirectionUndefined(position, direction) &&
      this.isArrowActive(position, direction)
    );
  }

  createArrowString(position, direction, column) {
    let text = '';
    text += this.writeArrowTypeString(position, direction, column);
    text += this.writeArrowTextString(position, direction);
    text += this.writeArrowTextTwoString(position, direction);
    return text;
  }

  writeArrowTypeString(position, direction, column) {
    const { type } = this.state.arrowsObject[position][direction];
    if (TaylorDiagram.isFirstColumn(column)) {
      return TaylorDiagram.handleArrowOnFirstColumn(direction, type);
    }
    return TaylorDiagram.returnArrowWithAmpersand(direction, type);
  }

  writeArrowTextString(position, direction) {
    const { text } = this.state.arrowsObject[position][direction];
    if (!TaylorDiagram.isStringEmpty(text)) {
      return `^{${text}}`;
    }
    return '';
  }

  writeArrowTextTwoString(position, direction) {
    const { text2 } = this.state.arrowsObject[position][direction];
    if (!TaylorDiagram.isStringEmpty(text2)) {
      return `^{${text2}}`;
    }
    return '';
  }

  addRowTextToString(position, column) {
    if (column === 1) {
      return ` ${this.state.textsObject[position]}`;
    }
    return ` & ${this.state.textsObject[position]}`;
  }

  addEmptyColumnIfNeccessaryInTextRow(position, positionOneColumnRight, column) {
    if (
      !this.isAdditionalArrowsObjectUndefined() &&
      !this.isArrowWithDirectionUndefined(position, 'r') &&
      !this.isArrowActive(position, 'r') &&
      !this.isArrowObjectOnPositionUndefined(positionOneColumnRight) &&
      !this.isArrowWithDirectionUndefined(positionOneColumnRight, 'l') &&
      !this.isArrowActive(positionOneColumnRight, 'l') &&
      this.state.additionalArrowsObject[column.toString()]
    ) {
      return ' & ';
    }
    return '';
  }

  addEmptyColumnIfNeccessaryInArrowRow(
    positionDownLeftArrow,
    positionDownRightArrow,
    positionUpperLeftArrow,
    positionUpperRightArrow,
    column,
  ) {
    if (
      !this.isAdditionalArrowsObjectUndefined() &&
      this.state.additionalArrowsObject[column.toString()] &&
      (this.isArrowObjectOnPositionUndefined(positionUpperLeftArrow) ||
        (!this.isArrowObjectOnPositionUndefined(positionUpperLeftArrow) &&
          !this.isArrowActive(positionUpperLeftArrow, 'rd'))) &&
      (this.isArrowObjectOnPositionUndefined(positionUpperRightArrow) ||
        (!this.isArrowObjectOnPositionUndefined(positionUpperRightArrow) &&
          !this.isArrowActive(positionUpperRightArrow, 'ld'))) &&
      (this.isArrowObjectOnPositionUndefined(positionDownRightArrow) ||
        (!this.isArrowObjectOnPositionUndefined(positionDownRightArrow) &&
          !this.isArrowActive(positionDownRightArrow, 'lu'))) &&
      (this.isArrowObjectOnPositionUndefined(positionDownLeftArrow) ||
        (!this.isArrowObjectOnPositionUndefined(positionDownLeftArrow) &&
          !this.isArrowActive(positionDownLeftArrow, 'ru')))
    ) {
      return ' & ';
    }
    return '';
  }

  checkIfArrowRowIsEmpty(downArrowPosition, upperArrowPosition) {
    if (
      this.isArrowDefinedAndActive(downArrowPosition, 'ld') ||
      this.isArrowDefinedAndActive(downArrowPosition, 'd') ||
      this.isArrowDefinedAndActive(downArrowPosition, 'rd') ||
      this.isArrowDefinedAndActive(upperArrowPosition, 'lu') ||
      this.isArrowDefinedAndActive(upperArrowPosition, 'u') ||
      this.isArrowDefinedAndActive(upperArrowPosition, 'ru')
    ) {
      return false;
    }
    return true;
  }

  downArrowExists(currentPosition, currentColumn) {
    return this.checkForArrow(currentPosition, 'd', currentColumn);
  }

  leftDownArrowExists(currentPositionOneColumnRight) {
    return (
      !this.isArrowObjectOnPositionUndefined(currentPositionOneColumnRight) &&
      !this.isArrowActive(currentPositionOneColumnRight, 'ld')
    );
  }

  rightDownArrowExists(currentPositionOneColumnLeft) {
    return (
      !this.isArrowObjectOnPositionUndefined(currentPositionOneColumnLeft) &&
      !this.isArrowActive(currentPositionOneColumnLeft, 'rd')
    );
  }

  rightArrowExists(currentPosition) {
    return (
      !this.isArrowObjectOnPositionUndefined(currentPosition) &&
      !this.isArrowActive(currentPosition, 'r')
    );
  }

  generateCoreCode(totalRows) {
    const code = [];
    for (let row = 1; row <= totalRows; row += 1) {
      const defaultColumns = 3;
      const totalColumns = this.getNumberOfColumns(defaultColumns, row);
      let rowText = '';

      for (let column = 1; column <= totalColumns; column += 1) {
        const position = row.toString() + column.toString();
        if (this.isGeneratingCodeOnRowPossible(position)) {
          const positionOneColumnRight = row.toString() + (column + 1).toString();
          const positionOneColumnLeft = row.toString() + (column - 1).toString();
          if (this.rightArrowExists(positionOneColumnLeft)) {
            rowText += this.checkForArrow(position, 'l', column);
          }
          rowText += this.addRowTextToString(position, column);

          rowText += this.addEmptyColumnIfNeccessaryInTextRow(
            position,
            positionOneColumnRight,
            column,
          );

          rowText += this.checkForArrow(position, 'r', column);

          if (TaylorDiagram.isLastColumn(column, totalColumns)) {
            rowText += ' &#92;&#92;\n';
            let isArrowRowEmpty = true;
            for (let currentColumn = 1; currentColumn <= totalColumns; currentColumn += 1) {
              const currentPosition = row.toString() + currentColumn.toString();
              const currentPositionOneRowDown = (row + 1).toString() + currentColumn.toString();
              const currentPositionOneColumnLeft = row.toString() + (currentColumn - 1).toString();
              const currentPositionOneColumnRight = row.toString() + (currentColumn + 1).toString();
              const currentPositionOneRowDownLeft = (row + 1).toString() + currentColumn.toString();
              const currentPositionOneRowDownRight =
                (row + 1).toString() + (currentColumn + 1).toString();

              if (!this.checkIfArrowRowIsEmpty(currentPosition, currentPositionOneRowDown)) {
                isArrowRowEmpty = false;
              }

              rowText += this.checkForArrow(currentPosition, 'ld', currentColumn);
              if (this.rightDownArrowExists(currentPositionOneColumnLeft)) {
                rowText += this.checkForArrow(currentPositionOneRowDown, 'lu', currentColumn);
              }
              rowText += this.checkForArrow(currentPosition, 'd', currentColumn);
              if (this.downArrowExists(currentPosition, currentColumn) !== '') {
                rowText += this.addEmptyColumnIfNeccessaryInArrowRow(
                  currentPositionOneRowDownLeft,
                  currentPositionOneRowDownRight,
                  currentPosition,
                  currentPositionOneColumnRight,
                  currentColumn,
                );
              }

              rowText += this.checkForArrow(currentPosition, 'rd', currentColumn);
              rowText += this.checkForArrow(currentPositionOneRowDown, 'u', currentColumn);
              if (this.leftDownArrowExists(currentPositionOneColumnRight)) {
                rowText += this.checkForArrow(currentPositionOneRowDown, 'ru', currentColumn);
              }
            }
            if (isArrowRowEmpty) {
              rowText = rowText.replace(/&#92;&#92;\n/g, ' ');
            }
          }
        }
      }
      rowText += TaylorDiagram.checkIfOnLastRow(row, totalRows);
      code.push(rowText);
    }
    return code;
  }

  // checks any occurences of "r", "rd", "ru", "l", "ld", "lu" arrows
  checkArrowObjectForArrows() {
    let numOfRows = 2;
    if (this.state !== undefined) {
      numOfRows = this.state.rows;
    }
    const numOfColumns = 10;
    for (let column = 1; column < numOfColumns; column += 1) {
      let additionalArrowInColumn = false;
      for (let row = 1; row <= numOfRows; row += 1) {
        const position = row.toString() + column.toString();
        const positionOneColumnAway = row.toString() + (column + 1).toString();

        if (this.state !== undefined && this.state.arrowsObject[position] !== undefined) {
          if (
            (this.state.arrowsObject[position].r !== undefined &&
              this.state.arrowsObject[position].r.active) ||
            (this.state.arrowsObject[position].rd !== undefined &&
              this.state.arrowsObject[position].rd.active) ||
            (this.state.arrowsObject[position].ru !== undefined &&
              this.state.arrowsObject[position].ru.active)
          ) {
            const key = column.toString();
            const obj = this.state.additionalArrowsObject;
            obj[key] = true;
            additionalArrowInColumn = true;
            this.setState({
              additionalArrowsObject: obj,
            });
            localStorage.setItem('taylor-additional-arrow-object', JSON.stringify(obj));
          }
          if (
            (this.state.arrowsObject[positionOneColumnAway].l !== undefined &&
              this.state.arrowsObject[positionOneColumnAway].l.active) ||
            (this.state.arrowsObject[positionOneColumnAway].lr !== undefined &&
              this.state.arrowsObject[positionOneColumnAway].lr.active) ||
            (this.state.arrowsObject[positionOneColumnAway].ld !== undefined &&
              this.state.arrowsObject[positionOneColumnAway].ld.active)
          ) {
            const key = column.toString();
            const obj = this.state.additionalArrowsObject;
            obj[key] = true;
            additionalArrowInColumn = true;
            this.setState({
              additionalArrowsObject: obj,
            });
            localStorage.setItem('taylor-additional-arrow-object', JSON.stringify(obj));
          }
        }
      }
      if (!additionalArrowInColumn) {
        const key = column.toString();
        const obj = this.state.additionalArrowsObject;
        obj[key] = false;
        this.setState({
          additionalArrowsObject: obj,
        });
        localStorage.setItem('taylor-additional-arrow-object', JSON.stringify(obj));
      }
    }
  }

  handleArrowChange(row, column, direction, text, text2, type) {
    this.addArrowToObject(row, column, direction, text, text2, type);
    this.setState({
      latexCode: this.generateLatexCode(),
    });
  }

  handleArrowDelete(row, column, direction) {
    this.deleteArrowFromObject(row, column, direction);
  }

  changeProjectName(changedName) {
    this.setState(
      {
        projectName: changedName,
      },
      () => {
        this.saveTaylorToDatabase();
      },
    );
  }

  render() {
    const latexCode = <LatexCode code={this.state.latexCode} />;
    const rows = [];
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
      (localStorage.getItem('taylor-work-saved') === null &&
        localStorage.getItem('taylor-saved-limit-overeached') == null)
    ) {
      workSavedElement = '';
    }
    rows.push(
      <div className="taylor-diagram-size-container" key="first-row-key">
        <div className="taylor-rows-count">
          <div className="taylor-size-container">
            <ProjectName
              type="Taylor"
              name={projectName}
              projectNameChanged={(newValue) => {
                this.changeProjectName(newValue);
              }}
            />
            <label htmlFor="taylor-rows">Rows: {this.state.rows}</label>
            <div>
              <input
                id="taylor-rows"
                type="range"
                min="1"
                max="15"
                value={this.state.rows}
                onChange={this.handleRowsChange}
              />
            </div>
          </div>
          <Symbols />
          <div>
            <button
              className="basic-button"
              type="text"
              onClick={TaylorDiagram.removeTaylorFromLocalStorage}
            >
              Start new diagram
            </button>
            <div className="work-saved-container">{workSavedElement}</div>
          </div>
        </div>
        <hr className="taylor-separating-line" />
      </div>,
    );
    for (let row = 1; row <= this.state.rows; row += 1) {
      const columns = this.state.columnsObject[row];
      rows.push(
        <TaylorRow
          rowTextObject={JSON.stringify(this.state.textsObject)}
          onCellTextChange={this.handleCellTextChange}
          key={row}
          row={row}
          columns={columns}
          arrowPropertiesObject={JSON.stringify(this.state.arrowsObject)}
          onArrowDelete={(column, direction) => this.handleArrowDelete(row, column, direction)}
          onArrowChange={(column, direction, text, text2, type) =>
            this.handleArrowChange(row, column, direction, text, text2, type)
          }
          onColumnsChange={(columnsNewValue) => this.handleColumnsChange(row, columnsNewValue)}
        >
          {' '}
        </TaylorRow>,
      );
    }

    return (
      <div className="taylor-container">
        {rows}
        {latexCode}
      </div>
    );
  }
}

TaylorDiagram.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      key: PropTypes.number,
    }),
  }),
};

TaylorDiagram.defaultProps = {
  location: {},
};

export default withRouter(TaylorDiagram);
