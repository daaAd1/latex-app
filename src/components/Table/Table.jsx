import React from 'react';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import PropTypes from 'prop-types';
import Tour from 'reactour';
import LatexCode from '../UI/LatexCode';
import Symbols from '../UI/Symbols';
import TableRows from './TableRows';
import TableColumns from './TableColumns';
import TableCaption from './TableCaption';
import TableLabel from './TableLabel';
import TableBorderCell from './TableBorderCell';
import TableAlignmentCell from './TableAlignmentCell';
import TableInputCell from './TableInputCell';
import ProjectName from '../UI/ProjectName';
import { db } from '../../firebase';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: Table
**
*/

/*
Hlavný komponent časti generovania LaTeX kódu z tabuľky. Tento komponent pozostáva z
viacerých komponentov: TableAlignmentCell, TableBorderCell, TableCaption, TableLabel, 
TableInputCell, TableRows a taktiež aj z komponentov Symbols a LatexCode,
ktoré majú všetky časti spoločné.
*/

/*
Tento komponent dostáva od jednotlivých komponentov dáta, tieto dáta si potom zapisuje
a potom z nich generuje LaTeX kód, ktorý posiela do komponentu LatexCode na zobrazenie.
Príkladom môže byť zmena textu v tabuľke, kde TableInputCell pošle tomuto komponentu
riadok, stĺpec aj nový text. Funkcia addTextToObject pridá tento text do objektu textsObject
a vygeneruje nový kód funkciou generateLatexCode a následne vygenerovaný kód pošle
komponentu LatexCode.
*/

/*  global localStorage: false, console: false, window: false */

class Table extends React.Component {
  static resetApplicationState() {
    for (let key = 0; key < localStorage.length; key += 1) {
      if (localStorage.key(key).includes('table') || localStorage.key(key).includes('Table')) {
        localStorage.removeItem(localStorage.key(key));
        return Table.resetApplicationState();
      }
    }
    window.location.reload();
  }

  static getInitialRows() {
    return localStorage.getItem('table-rows') || 11;
  }

  static getInitialColumns() {
    return localStorage.getItem('table-columns') || 11;
  }

  static getInitialCaption() {
    return localStorage.getItem('table-caption') || '';
  }

  static getInitialLabel() {
    return localStorage.getItem('table-label') || '';
  }

  static getInitialWorkId() {
    return localStorage.getItem('table-work-id') || 0;
  }

  static getInitialProjectName() {
    return localStorage.getItem('Table-project-name') || 'Table project';
  }

  static getInitialWorkSaved() {
    let workSaved = localStorage.getItem('table-work-saved') || true;
    if (workSaved === 'false') {
      workSaved = false;
    } else {
      workSaved = true;
    }
    return workSaved;
  }

  static getInitialWorkSavedLimitOvereached() {
    let limitOvereached = localStorage.getItem('table-work-saved-limit-overeached') || false;
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
      rows: Table.getInitialRows(),
      columns: Table.getInitialColumns(),
      caption: Table.getInitialCaption(),
      label: Table.getInitialLabel(),
      projectName: Table.getInitialProjectName(),
      textsObject: this.getInitialTextsObject(),
      bordersObject: this.getInitialBordersObject(),
      alignmentsObject: this.getInitialAligmentsObject(),
      latexCode: '',
      refBorders: {},
      refAlignments: {},
      refInputCells: {},
      isSignedIn: false,
      userUid: '',
      workId: Table.getInitialWorkId(),
      workSaved: Table.getInitialWorkSaved(),
      workSavedLimitOvereached: Table.getInitialWorkSavedLimitOvereached(),
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.changeRows = this.changeRows.bind(this);
    this.changeColumns = this.changeColumns.bind(this);
    this.changeText = this.changeText.bind(this);
    this.changeCaption = this.changeCaption.bind(this);
    this.changeLabel = this.changeLabel.bind(this);
    this.changeProjectName = this.changeProjectName.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.addBorderToObject = this.addBorderToObject.bind(this);
    this.addAlignmentToObject = this.addAlignmentToObject.bind(this);
    this.writeToFirebase = this.writeToFirebase.bind(this);
    this.saveTable = this.saveTable.bind(this);
  }

  openExistingDiagram() {
    if (this.props.location !== undefined && this.props.location.state !== undefined) {
      const { key } = this.props.location.state;
      db.onceGetWorks(this.state.userUid).then((snapshot) => {
        const data = snapshot.val()[key];
        localStorage.setItem('table-work-id', key);
        localStorage.setItem('table-rows', Number(data.rows));
        localStorage.setItem('table-columns', Number(data.columns));
        localStorage.setItem('table-caption', data.caption);
        localStorage.setItem('table-label', data.label);
        localStorage.setItem('Table-project-name', data.projectName);
        localStorage.setItem('table-textsObject', JSON.stringify(JSON.parse(data.textsObject)));
        localStorage.setItem('table-borderObject', JSON.stringify(JSON.parse(data.bordersObject)));
        localStorage.setItem(
          'table-alignmentObject',
          JSON.stringify(JSON.parse(data.alignmentsObject)),
        );

        this.setState(
          {
            rows: Number(data.rows),
            columns: Number(data.columns),
            caption: data.caption,
            label: data.label,
            projectName: data.projectName,
            textsObject: JSON.parse(data.textsObject),
            bordersObject: JSON.parse(data.bordersObject),
            alignmentsObject: JSON.parse(data.alignmentsObject),
            workId: key,
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
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
        run: true,
        textsObject: this.createTextsObject(),
        bordersObject: this.createBordersObject(),
        alignmentsObject: this.createAlignmentsObject(),
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
        });
      },
    );
  }

  getInitialTextsObject() {
    return JSON.parse(localStorage.getItem('table-textsObject')) || this.createTextsObject();
  }

  getInitialBordersObject() {
    return JSON.parse(localStorage.getItem('table-borderObject')) || this.createBordersObject();
  }

  getInitialAligmentsObject() {
    return (
      JSON.parse(localStorage.getItem('table-alignmentObject')) || this.createAlignmentsObject()
    );
  }

  createTextsObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.textsObject !== undefined) {
      initialObject = this.state.textsObject;
      if (typeof initialObject === 'string') {
        initialObject = JSON.parse(initialObject);
      }
    }

    let numOfRows = 11;
    if (this.state !== undefined && this.state.rows !== undefined) {
      numOfRows = this.state.rows;
    }

    let numOfColumns = 11;
    if (this.state !== undefined && this.state.columns !== undefined) {
      numOfColumns = this.state.columns;
    }

    for (let row = 0; row < numOfRows; row += 1) {
      for (let column = 0; column < numOfColumns; column += 1) {
        const position = `${row}-${column}`;
        if (
          this.state !== undefined &&
          this.state.textsObject !== undefined &&
          this.state.textsObject[position] !== undefined
        ) {
          initialObject[position] = this.state.textsObject[position];
        } else {
          initialObject[position] = '';
        }
      }
    }
    return initialObject;
  }

  createBordersObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.bordersObject !== undefined) {
      initialObject = this.state.bordersObject;
      if (typeof initialObject === 'string') {
        initialObject = JSON.parse(initialObject);
      }
    }

    let numOfRows = 11;
    if (this.state !== undefined && this.state.rows !== undefined) {
      numOfRows = this.state.rows;
    }

    let numOfColumns = 11;
    if (this.state !== undefined && this.state.columns !== undefined) {
      numOfColumns = this.state.columns;
    }

    for (let row = 0; row < numOfRows; row += 1) {
      for (let column = 0; column < numOfColumns; column += 1) {
        const position = `${row}-${column}`;
        if (
          this.state !== undefined &&
          this.state.bordersObject !== undefined &&
          this.state.bordersObject[position] !== undefined
        ) {
          initialObject[position] = this.state.bordersObject[position];
        } else {
          initialObject[position] = false;
        }
      }
    }
    return initialObject;
  }

  createAlignmentsObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.alignmentsObject !== undefined) {
      initialObject = this.state.alignmentsObject;
      if (typeof initialObject === 'string') {
        initialObject = JSON.parse(initialObject);
      }
    }

    let numOfRows = 11;
    if (this.state !== undefined && this.state.rows !== undefined) {
      numOfRows = this.state.rows;
    }

    let numOfColumns = 11;
    if (this.state !== undefined && this.state.columns !== undefined) {
      numOfColumns = this.state.columns;
    }

    for (let row = 0; row < numOfRows; row += 1) {
      for (let column = 0; column < numOfColumns; column += 1) {
        const position = `${column}`;
        if (
          this.state !== undefined &&
          this.state.alignmentsObject !== undefined &&
          this.state.alignmentsObject !== undefined
        ) {
          initialObject[position] = this.state.alignmentsObject[position];
        } else {
          initialObject[position] = 'left';
        }
      }
    }
    return initialObject;
  }

  addTextToObject(row, column, text) {
    const key = `${row}-${column}`;
    const obj = this.state.textsObject;
    obj[key] = text;
    this.setState({
      textsObject: obj,
    });
    localStorage.setItem('table-textsObject', JSON.stringify(obj));
  }

  addBorderToObject(row, column, border) {
    const key = `${row}-${column}`;
    const obj = this.state.bordersObject;
    obj[key] = Boolean(border);
    this.setState({
      bordersObject: obj,
    });
    localStorage.setItem('table-borderObject', JSON.stringify(obj));
  }

  addAlignmentToObject(column, alignment) {
    const key = `${column}`;
    const obj = this.state.alignmentsObject;
    obj[key] = alignment;
    this.setState({
      alignmentsObject: obj,
    });
    localStorage.setItem('table-alignmentObject', JSON.stringify(obj));
  }

  updateWorkCount() {
    let workCount = 0;
    db.onceGetWorkCount(this.state.userUid).then((snapshot) => {
      if (snapshot.val() !== null && Number(snapshot.val().newWorkCount) > 14) {
        localStorage.setItem('table-work-saved-limit-overeached', true);
        this.setState({
          workSavedLimitOvereached: true,
        });
      } else {
        localStorage.setItem('table-work-saved-limit-overeached', false);
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
        localStorage.setItem('table-work-id', Number(workCount));
        this.writeToFirebase(workCount);
      }
    });
  }

  writeToFirebase(workId) {
    db.writeTableToDatabase(
      this.state.userUid,
      workId,
      this.state.projectName,
      'table',
      this.state.rows,
      this.state.columns,
      this.state.textsObject,
      this.state.bordersObject,
      this.state.alignmentsObject,
      this.state.caption,
      this.state.label,
    ).then(() => {
      localStorage.setItem('table-work-saved', true);
      this.setState({
        workSaved: true,
      });
    });
  }

  saveTable() {
    if (this.state.isSignedIn) {
      localStorage.setItem('table-work-saved', false);
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

  generateLatexCode(rows, columns) {
    this.saveTable();
    const beginTable = [' &#92;begin{table} '];
    const endTabular = ['   &#92;end{tabular} '];
    const endTable = [' &#92;end{table} '];

    const columnTable = [];
    let columnBorderText = '   &#92;begin{tabular}{';
    const coreTable = [];

    for (let row = 0; row < rows; row += 1) {
      let rowText = '';
      for (let column = 0; column < columns; column += 1) {
        const columnId = (column + 1).toString();
        const borderId = `${row}-${column}`;
        let borderCell;
        if (this.state !== undefined) {
          borderCell = this.state.refBorders[borderId];
        }
        if (column % 2 === 0 && row === 0) {
          let textAlignment;
          if (
            this.state !== undefined &&
            this.state.refAlignments[columnId] !== undefined &&
            this.state.refAlignments[columnId] !== null
          ) {
            const { alignment } = this.state.refAlignments[columnId].state;
            if (alignment === 'center') {
              textAlignment = 'c';
            } else if (alignment === 'right') {
              textAlignment = 'r';
            } else {
              textAlignment = 'l';
            }
          } else {
            textAlignment = 'l';
          }
          if (borderCell !== undefined && borderCell !== null) {
            if (borderCell.state.active === true) {
              if (column === columns - 1) {
                columnBorderText += '|';
              } else {
                columnBorderText += `|${textAlignment}`;
              }
            } else if (column !== columns - 1) {
              columnBorderText += textAlignment;
            }
          } else if (column !== columns - 1) {
            columnBorderText += textAlignment;
          }
        }

        let textOnPosition = '';
        if (this.state !== undefined) {
          textOnPosition = this.state.textsObject[row.toString() + '-' + column.toString()];
        }
        if (textOnPosition === '') {
          textOnPosition = '~';
        }
        if (column % 2 !== 0) {
          if (column === columns - 2) {
            rowText += textOnPosition;
          } else if (column === 1) {
            rowText += `        ${textOnPosition} & `;
          } else {
            rowText += `${textOnPosition} & `;
          }
        }
      }
      rowText += ' &#92;&#92;';
      let borderCell;
      let borderCell2;
      if (row % 2 !== 0) {
        if (this.state !== undefined) {
          if (row === 1) {
            if (this.state.refBorders[`${row - 1}-1`] !== null) {
              borderCell = this.state.refBorders[`${row - 1}-1`];
            }
            if (this.state.refBorders[`${row + 1}-1`] !== null) {
              borderCell2 = this.state.refBorders[`${row + 1}-1`];
            }
          } else if (this.state.refBorders[`${row + 1}-1`] !== null) {
            borderCell = this.state.refBorders[`${row + 1}-1`];
          }
        }
      }

      if (row === 1) {
        if (
          borderCell !== undefined &&
          borderCell.state !== undefined &&
          borderCell.state.active === true
        ) {
          if (
            borderCell2 !== undefined &&
            borderCell2.state !== undefined &&
            borderCell2.state.active === true
          ) {
            // top row + second row
            const currentRowText = rowText;
            rowText = '       &#92;hline\n';
            rowText += `${currentRowText}  &#92;hline`;
          } else {
            // top row without second row
            const currentRowText = rowText;
            rowText = '       &#92;hline\n';
            rowText += currentRowText;
          }
        } else if (
          borderCell2 !== undefined &&
          borderCell2.state !== undefined &&
          borderCell2.state.active === true
        ) {
          // second row without top row
          rowText += '  &#92;hline';
        }
      } else if (
        borderCell !== undefined &&
        borderCell.state !== undefined &&
        borderCell.state.active === true
      ) {
        // other rows
        rowText += '  &#92;hline';
      }

      if (row % 2 !== 0) {
        coreTable.push(rowText);
      }

      if (row === 0) {
        columnBorderText += '}';
        columnTable.push(columnBorderText);
      }
    }

    const captionLabelTable = [];
    if (this.state !== undefined) {
      captionLabelTable.push(`   &#92;caption{${this.state.caption}}`);
      captionLabelTable.push(`   &#92;label{${this.state.label}}`);
    } else {
      captionLabelTable.push('   &#92;caption{ }');
      captionLabelTable.push('   &#92;label{ }');
    }

    return [
      beginTable.join('\n'),
      columnTable.join('\n'),
      coreTable.join('\n'),
      endTabular,
      captionLabelTable.join('\n'),
      endTable,
    ].join('\n');
  }

  changeRows(newRows) {
    // have to call generateLatex as callback
    // because of setState asynchronity
    const rowsRightValue = newRows * 2 + 1;
    this.setState(
      {
        rows: rowsRightValue,
      },
      () => {
        this.setState(
          {
            textsObject: this.createTextsObject(),
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(rowsRightValue, this.state.columns),
            });
          },
        );
      },
    );
    localStorage.setItem('table-rows', rowsRightValue);
  }

  changeColumns(newColumns) {
    // have to call generateLatex as callback
    // because of setState asynchronity
    const columnsRightValue = newColumns * 2 + 1;
    this.setState(
      {
        columns: columnsRightValue,
      },
      () => {
        this.setState(
          {
            textsObject: this.createTextsObject(this.state.rows, columnsRightValue),
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(this.state.rows, columnsRightValue),
            });
          },
        );
      },
    );
    localStorage.setItem('table-columns', columnsRightValue);
  }

  changeText(newText, row, column) {
    this.addTextToObject(row, column, newText);
    this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
    });
  }

  selectBorder(row, column, direction) {
    const border = this.state.refBorders[`${row}-${column}`];
    let newBorderActiveValue = false;
    if (border !== null && border !== undefined) {
      newBorderActiveValue = !border.state.active;
    }
    if (direction === 'row') {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder += 1) {
        const borderCell = this.state.refBorders[`${row}-${columnBorder}`];
        if (
          borderCell !== null &&
          borderCell !== undefined &&
          borderCell.state.direction === 'row'
        ) {
          this.addBorderToObject(row, columnBorder, newBorderActiveValue);
          localStorage.setItem(
            `table-border-row${row}-column${columnBorder}`,
            Boolean(newBorderActiveValue),
          );
          borderCell.setState(
            {
              active: newBorderActiveValue,
            },
            () => {
              this.setState(
                {
                  latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
                },
                () => {
                  this.setState({
                    latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
                  });
                },
              );
            },
          );
        }
      }
    } else if (direction === 'column') {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder += 1) {
        const borderCell = this.state.refBorders[`${rowBorder}-${column}`];
        if (
          borderCell !== null &&
          borderCell !== undefined &&
          borderCell.state.direction === 'column'
        ) {
          this.addBorderToObject(rowBorder, column, newBorderActiveValue);
          localStorage.setItem(
            `table-border-row${rowBorder}-column${column}`,
            Boolean(newBorderActiveValue),
          );
          borderCell.setState(
            {
              active: newBorderActiveValue,
            },
            () => {
              this.setState({
                latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
              });
            },
          );
        }
      }
    }
  }

  hoverBorder(row, column, direction, hover) {
    if (direction === 'row') {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder += 1) {
        const borderCell = this.state.refBorders[`${row}-${columnBorder}`];
        if (borderCell !== null && borderCell !== undefined) {
          borderCell.setState({
            hover,
          });
        }
      }
    } else if (direction === 'column') {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder += 1) {
        const borderCell = this.state.refBorders[`${rowBorder}-${column}`];
        if (borderCell !== null && borderCell !== undefined) {
          borderCell.setState({
            hover,
          });
        }
      }
    }
  }

  alignCell(column) {
    const columnId = column.toString();
    for (let row = 0; row < this.state.rows; row += 1) {
      if (
        this.state !== undefined &&
        row % 2 !== 0 &&
        this.state.refAlignments[columnId] !== undefined &&
        this.state.refInputCells[`${row}-${columnId}`] !== undefined
      ) {
        const { alignment } = this.state.refAlignments[columnId].state;
        const inputCell = this.state.refInputCells[`${row}-${columnId}`];
        inputCell.setState(
          {
            alignment,
          },
          () => {
            const alignValue = this.state.refAlignments[columnId].state.alignment;
            this.addAlignmentToObject(column, alignValue);
            this.setState({
              latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
            });
          },
        );
      }
    }
  }

  changeCaption(changedCaptionText) {
    this.setState(
      {
        caption: changedCaptionText,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
        });
      },
    );
    localStorage.setItem('table-caption', changedCaptionText);
  }

  changeLabel(changedLabelText) {
    this.setState(
      {
        label: changedLabelText,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
        });
      },
    );
    localStorage.setItem('table-label', changedLabelText);
  }

  changeProjectName(changedName) {
    this.setState(
      {
        projectName: changedName,
      },
      () => {
        this.saveTable();
      },
    );
  }

  render() {
    const latexCode = <LatexCode code={this.state.latexCode} />;
    const rows = [];
    for (let row = -1; row < this.state.rows; row += 1) {
      const cell = [];
      for (let column = 0; column < this.state.columns; column += 1) {
        const cellId = `cell${row}-${column}`;
        const stringId = `${row}-${column}`;
        const columnId = column.toString();
        const borderActive = this.state.bordersObject[stringId];
        const alignment = this.state.alignmentsObject[columnId];
        if (row === -1) {
          if (column % 2 !== 0) {
            cell.push(
              <TableAlignmentCell
                key={cellId}
                column={column}
                alignment={alignment}
                onClick={this.alignCell.bind(this, column)}
                ref={(input) => {
                  this.state.refAlignments[columnId] = input;
                }}
              />,
            );
          }
        } else if (row === 0) {
          if (column % 2 === 0) {
            cell.push(
              <TableBorderCell
                key={cellId}
                row={row}
                column={column}
                active={borderActive}
                direction="column"
                onClick={this.selectBorder.bind(this, row, column, 'column')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'column', true)}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'column', false)}
                ref={(input) => {
                  this.state.refBorders[stringId] = input;
                }}
              />,
            );
          } else {
            cell.push(
              <TableBorderCell
                key={cellId}
                row={row}
                column={column}
                direction="row"
                active={borderActive}
                onClick={this.selectBorder.bind(this, row, column, 'row')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'row', true)}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'row', false)}
                ref={(input) => {
                  this.state.refBorders[stringId] = input;
                }}
              />,
            );
          }
        } else if (row % 2 === 0) {
          if (column % 2 === 0) {
            cell.push(
              <TableBorderCell
                key={cellId}
                onClick={this.selectBorder.bind(this, row, column, 'column')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'column')}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'column', false)}
                row={row}
                column={column}
                active={borderActive}
                direction="column"
                ref={(input) => {
                  this.state.refBorders[stringId] = input;
                }}
              />,
            );
          } else {
            cell.push(
              <TableBorderCell
                key={cellId}
                onClick={this.selectBorder.bind(this, row, column, 'row')}
                onMouseEnter={this.hoverBorder.bind(this, row, column, 'row', true)}
                onMouseLeave={this.hoverBorder.bind(this, row, column, 'row', false)}
                row={row}
                column={column}
                active={borderActive}
                direction="row"
                ref={(input) => {
                  this.state.refBorders[stringId] = input;
                }}
              />,
            );
          }
        } else if (column % 2 === 0) {
          cell.push(
            <TableBorderCell
              key={cellId}
              onClick={this.selectBorder.bind(this, row, column, 'column')}
              onMouseEnter={this.hoverBorder.bind(this, row, column, 'column', true)}
              onMouseLeave={this.hoverBorder.bind(this, row, column, 'column', false)}
              ref={(input) => {
                this.state.refBorders[stringId] = input;
              }}
              active={borderActive}
              row={row}
              column={column}
              direction="column"
            />,
          );
        } else {
          let inputText = '';
          if (
            this.state !== undefined &&
            this.state.refAlignments[columnId] !== undefined &&
            this.state.refAlignments[columnId] !== null &&
            this.state.alignmentsObject !== undefined &&
            this.state.alignmentsObject !== null
          ) {
            if (this.state !== undefined && this.state.textsObject !== undefined) {
              inputText = this.state.textsObject[stringId];
            }
            const alignValue = this.state.alignmentsObject[columnId];
            cell.push(
              <td className="td" key={cellId}>
                <TableInputCell
                  changedText={this.changeText}
                  row={row}
                  column={column}
                  alignment={alignValue}
                  text={inputText}
                  ref={(input) => {
                    this.state.refInputCells[stringId] = input;
                  }}
                />{' '}
              </td>,
            );
          } else {
            if (this.state !== undefined && this.state.textsObject !== undefined) {
              inputText = this.state.textsObject[stringId];
            }
            cell.push(
              <td className="td" key={cellId}>
                <TableInputCell
                  changedText={this.changeText}
                  row={row}
                  column={column}
                  text={inputText}
                  alignment="left"
                  ref={(input) => {
                    this.state.refInputCells[stringId] = input;
                  }}
                />{' '}
              </td>,
            );
          }
        }
      }
      if (row % 2 === 0) {
        rows.push(
          <tr key={row} className="borderRow">
            {cell}
          </tr>,
        );
      } else {
        rows.push(
          <tr className="tr" key={row}>
            {cell}
          </tr>,
        );
      }
    }
    const { caption, label, projectName } = this.state;
    const rowsValue = (this.state.rows - 1) / 2;
    const columnsValue = (this.state.columns - 1) / 2;
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
      (localStorage.getItem('table-work-saved') === null &&
        localStorage.getItem('table-work-saved-limit-overeached') == null)
    ) {
      workSavedElement = '';
    }
    return (
      <div className="table-container">
        <Tour steps={steps} isOpen={this.state.isTourOpen} onRequestClose={this.closeTour} />
        <div className="table-size-container">
          <div className="table-form-container">
            <div className="table-caption-label-container">
              <TableCaption changeCaption={this.changeCaption} caption={caption} />
              <TableLabel changeLabel={this.changeLabel} label={label} />
              <ProjectName
                type="Table"
                name={projectName}
                projectNameChanged={(newName) => {
                  this.changeProjectName(newName);
                }}
              />
            </div>
            <div className="table-rows-columns-container">
              <TableRows rowValue={this.changeRows} rows={rowsValue} />
              <TableColumns columnValue={this.changeColumns} columns={columnsValue} />
              <div className="work-saved-container">{workSavedElement}</div>
            </div>
          </div>
          <div className="table-button-symbols-container">
            <button className="basic-button " type="text" onClick={Table.resetApplicationState}>
              Start new table
            </button>
            <Symbols />
          </div>
        </div>
        <hr className="table-separating-line" />
        <div className="table-container">
          <table>
            <tbody>{rows}</tbody>
          </table>
        </div>
        {latexCode}
      </div>
    );
  }
}

const steps = [
  {
    selector: '[data-tour="my-first-step"]',
    content: ({ goTo, inDOM }) => (
      <div>
        Lorem ipsum <button onClick={() => goTo(4)}>Go to Step 5</button>
        <br />
        {inDOM && '🎉 Look at your step!'}
      </div>
    ),
    position: 'top',
    action: (node) => {
      node.focus();
      console.log('yup, the target element is also focused!');
    },
    style: {
      backgroundColor: '#bada55',
    },
  },
  // ...
];

Table.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      key: PropTypes.string,
    }),
  }),
};

Table.defaultProps = {
  location: {},
};

export default withRouter(Table);
