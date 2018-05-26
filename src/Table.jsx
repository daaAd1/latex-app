import React from 'react';
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import LatexCode from './LatexCode';
import Symbols from './Symbols';
import TableRows from './TableRows';
import TableColumns from './TableColumns';
import TableCaption from './TableCaption';
import TableLabel from './TableLabel';
import TableBorderCell from './TableBorderCell';
import TableAlignmentCell from './TableAlignmentCell';
import TableInputCell from './TableInputCell';
import ProjectName from './ProjectName';
import { auth, db } from './firebase';

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
riadok, stĺpec aj nový text. Funkcia addTextToObject pridá tento text do objektu textInTable
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

  static getInitialRowsState() {
    const localRows = localStorage.getItem('table-rows') || 11;
    return localRows;
  }

  static getInitialColumnsState() {
    const columns = localStorage.getItem('table-columns') || 11;
    return columns;
  }

  static getInitialCaption() {
    const caption = localStorage.getItem('table-caption') || '';
    return caption;
  }

  static getInitialLabel() {
    const label = localStorage.getItem('table-label') || '';
    return label;
  }

  static getInitialWorkId() {
    const workId = localStorage.getItem('table-work-id') || 0;
    return workId;
  }

  static getInitialProjectName() {
    const projectName = localStorage.getItem('Table-project-name') || 'Table project';
    return projectName;
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: Table.getInitialRowsState(),
      columns: Table.getInitialColumnsState(),
      caption: Table.getInitialCaption(),
      label: Table.getInitialLabel(),
      textInTable: this.getInitialTextObject(),
      borderInTable: this.getInitialBorderObject(),
      alignmentInTable: this.getInitialAligmentObject(),
      latexCode: '',
      refToBorders: {},
      refToAlignments: {},
      refToInputs: {},
      workId: Table.getInitialWorkId(),
      projectName: Table.getInitialProjectName(),
      isSignedIn: false,
      userUid: '',
      workSaved: true,
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.inputRowsChanged = this.inputRowsChanged.bind(this);
    this.inputColumnsChanged = this.inputColumnsChanged.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.addBorderToObject = this.addBorderToObject.bind(this);
    this.addAlignmentToObject = this.addAlignmentToObject.bind(this);
    this.changeCaption = this.changeCaption.bind(this);
    this.changeLabel = this.changeLabel.bind(this);
    this.writeToFirebase = this.writeToFirebase.bind(this);
    this.projectNameChanged = this.projectNameChanged.bind(this);
    this.saveTable = this.saveTable.bind(this);
  }

  componentWillMount() {
    if (this.props.location !== undefined && this.props.location.state !== undefined) {
      const { key } = this.props.location.state;
      db.onceGetWorks(this.state.userUid).then((snapshot) => {
        const data = snapshot.val()[this.state.userUid][key];
        localStorage.setItem('table-work-id', key);
        localStorage.setItem('table-rows', Number(data.rows));
        localStorage.setItem('table-columns', Number(data.columns));
        localStorage.setItem('table-caption', data.caption);
        localStorage.setItem('table-label', data.label);
        localStorage.setItem('Table-project-name', data.projectName);
        localStorage.setItem('table-textObject', JSON.stringify(JSON.parse(data.textInTable)));
        localStorage.setItem('table-borderObject', JSON.stringify(JSON.parse(data.borderInTable)));
        localStorage.setItem(
          'table-alignmentObject',
          JSON.stringify(JSON.parse(data.alignmentInTable)),
        );

        this.setState(
          {
            rows: Number(data.rows),
            columns: Number(data.columns),
            caption: data.caption,
            label: data.label,
            projectName: data.projectName,
            textInTable: JSON.parse(data.textInTable),
            borderInTable: JSON.parse(data.borderInTable),
            alignmentInTable: JSON.parse(data.alignmentInTable),
            workId: key,
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(this.state.rows),
            });
          },
        );
      });
    }
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isSignedIn: !!user, userUid: user.uid });
      }
    });

    this.setState(
      {
        //textInTable: this.initializeTextObject(),
        //borderInTable: this.initializeBorderObject(),
        //alignmentInTable: this.initializeAlignmentObject(),
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
        });
      },
    );
  }

  getInitialTextObject() {
    const textObject =
      JSON.parse(localStorage.getItem('table-textObject')) || this.initializeTextObject();

    return textObject;
  }

  getInitialBorderObject() {
    const borderObject =
      JSON.parse(localStorage.getItem('table-borderObject')) || this.initializeBorderObject();

    return borderObject;
  }

  getInitialAligmentObject() {
    const alignmentObject =
      JSON.parse(localStorage.getItem('table-alignmentObject')) || this.initializeAlignmentObject();
    return alignmentObject;
  }

  initializeTextObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.textInTable !== undefined) {
      initialObject = this.state.textInTable;
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
          this.state.textInTable !== undefined &&
          this.state.textInTable[position] !== undefined
        ) {
          initialObject[position] = this.state.textInTable[position];
        } else {
          initialObject[position] = '';
        }
      }
    }
    return initialObject;
  }

  initializeBorderObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.borderInTable !== undefined) {
      initialObject = this.state.borderInTable;
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
          this.state.borderInTable !== undefined &&
          this.state.borderInTable[position] !== undefined
        ) {
          initialObject[position] = this.state.borderInTable[position];
        } else {
          initialObject[position] = false;
        }
      }
    }
    return initialObject;
  }

  initializeAlignmentObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.alignmentInTable !== undefined) {
      initialObject = this.state.alignmentInTable;
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
          this.state.alignmentInTable !== undefined &&
          this.state.alignmentInTable !== undefined
        ) {
          initialObject[position] = this.state.alignmentInTable[position];
        } else {
          initialObject[position] = 'left';
        }
      }
    }
    return initialObject;
  }

  addTextToObject(row, column, text) {
    const key = `${row}-${column}`;
    const obj = this.state.textInTable;
    obj[key] = text;
    this.setState({
      textInTable: obj,
    });
    localStorage.setItem('table-textObject', JSON.stringify(obj));
  }

  addBorderToObject(row, column, border) {
    const key = `${row}-${column}`;
    const obj = this.state.borderInTable;
    obj[key] = Boolean(border);
    this.setState({
      borderInTable: obj,
    });
    localStorage.setItem('table-borderObject', JSON.stringify(obj));
  }

  addAlignmentToObject(column, alignment) {
    const key = `${column}`;
    const obj = this.state.alignmentInTable;
    obj[key] = alignment;
    this.setState({
      alignmentInTable: obj,
    });
    localStorage.setItem('table-alignmentObject', JSON.stringify(obj));
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
      localStorage.setItem('table-work-id', Number(workCount));
      this.writeToFirebase(workCount);
    });
  }

  writeToFirebase(workId) {
    db
      .writeTableToDatabase(
        this.state.userUid,
        workId,
        this.state.projectName,
        'table',
        this.state.rows,
        this.state.columns,
        this.state.textInTable,
        this.state.borderInTable,
        this.state.alignmentInTable,
        this.state.caption,
        this.state.label,
      )
      .then(() => {
        this.setState({
          workSaved: true,
        });
      });
  }

  saveTable() {
    if (this.state.isSignedIn) {
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
          borderCell = this.state.refToBorders[borderId];
        }
        if (column % 2 === 0 && row === 0) {
          let textAlignment;
          if (
            this.state !== undefined &&
            this.state.refToAlignments[columnId] !== undefined &&
            this.state.refToAlignments[columnId] !== null
          ) {
            const { alignment } = this.state.refToAlignments[columnId].state;
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
          textOnPosition = this.state.textInTable[row.toString() + '-' + column.toString()];
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
            if (this.state.refToBorders[`${row - 1}-1`] !== null) {
              borderCell = this.state.refToBorders[`${row - 1}-1`];
            }
            if (this.state.refToBorders[`${row + 1}-1`] !== null) {
              borderCell2 = this.state.refToBorders[`${row + 1}-1`];
            }
          } else if (this.state.refToBorders[`${row + 1}-1`] !== null) {
            borderCell = this.state.refToBorders[`${row + 1}-1`];
          }
        }
      }
      if (row === 1) {
        if (
          borderCell !== undefined &&
          borderCell.state !== undefined &&
          borderCell.state.active === true
        ) {
          if (borderCell2 !== undefined && borderCell2.state.active === true) {
            const currentRowText = rowText;
            rowText = '      &#92;hline\n';
            rowText += `${currentRowText} &#92;hline`;
          } else {
            const currentRowText = rowText;
            rowText = '      &#92;hline\n';
            rowText += currentRowText;
          }
        } else if (borderCell2 !== undefined && borderCell2.state.active === true) {
          rowText += ' &#92;hline';
        }
      } else if (borderCell !== undefined && borderCell.state.active === true) {
        rowText += ' &#92;hline';
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

  inputRowsChanged(changedRowCount) {
    // have to call generateLatex as callback
    // because of setState asynchronity
    this.setState(
      {
        rows: changedRowCount * 2 + 1,
      },
      () => {
        this.setState(
          {
            textInTable: this.initializeTextObject(),
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(changedRowCount * 2 + 1, this.state.columns),
            });
          },
        );
      },
    );
    localStorage.setItem('table-rows', changedRowCount * 2 + 1);
  }

  inputColumnsChanged(changedColumnCount) {
    // have to call generateLatex as callback
    // because of setState asynchronity
    this.setState(
      {
        columns: changedColumnCount * 2 + 1,
      },
      () => {
        this.setState(
          {
            textInTable: this.initializeTextObject(this.state.rows, changedColumnCount * 2 + 1),
          },
          () => {
            this.setState({
              latexCode: this.generateLatexCode(this.state.rows, changedColumnCount * 2 + 1),
            });
          },
        );
      },
    );
    localStorage.setItem('table-columns', changedColumnCount * 2 + 1);
  }

  inputTextChanged(changedTextValue, row, column) {
    this.addTextToObject(row, column, changedTextValue);
    this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
    });
  }

  selectBorder(row, column, direction) {
    const border = this.state.refToBorders[`${row}-${column}`];
    let newBorderActiveValue = false;
    if (border !== null && border !== undefined) {
      newBorderActiveValue = !border.state.active;
    }
    if (direction === 'row') {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder += 1) {
        const borderCell = this.state.refToBorders[`${row}-${columnBorder}`];
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
              this.setState({
                latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
              });
            },
          );
        }
      }
    } else if (direction === 'column') {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder += 1) {
        const borderCell = this.state.refToBorders[`${rowBorder}-${column}`];
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
        const borderCell = this.state.refToBorders[`${row}-${columnBorder}`];
        if (borderCell !== null && borderCell !== undefined) {
          borderCell.setState({
            hover,
          });
        }
      }
    } else if (direction === 'column') {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder += 1) {
        const borderCell = this.state.refToBorders[`${rowBorder}-${column}`];
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
        this.state.refToAlignments[columnId] !== undefined &&
        this.state.refToInputs[`${row}-${columnId}`] !== undefined
      ) {
        const { alignment } = this.state.refToAlignments[columnId].state;
        const inputCell = this.state.refToInputs[`${row}-${columnId}`];
        inputCell.setState(
          {
            alignment,
          },
          () => {
            const alignValue = this.state.refToAlignments[columnId].state.alignment;
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

  projectNameChanged(changedName) {
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
        const borderActive = this.state.borderInTable[stringId];
        const alignment = this.state.alignmentInTable[columnId];
        if (row === -1) {
          if (column % 2 !== 0) {
            cell.push(
              <TableAlignmentCell
                key={cellId}
                column={column}
                alignment={alignment}
                onClick={this.alignCell.bind(this, column)}
                ref={(input) => {
                  this.state.refToAlignments[columnId] = input;
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
                  this.state.refToBorders[stringId] = input;
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
                  this.state.refToBorders[stringId] = input;
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
                  this.state.refToBorders[stringId] = input;
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
                  this.state.refToBorders[stringId] = input;
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
                this.state.refToBorders[stringId] = input;
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
            this.state.refToAlignments[columnId] !== undefined &&
            this.state.refToAlignments[columnId] !== null &&
            this.state.alignmentInTable !== undefined &&
            this.state.alignmentInTable !== null
          ) {
            if (this.state !== undefined && this.state.textInTable !== undefined) {
              inputText = this.state.textInTable[stringId];
            }
            //const alignValue = this.state.refToAlignments[columnId].state.alignment;
            const alignValue = this.state.alignmentInTable[columnId];
            cell.push(
              <td className="td" key={cellId}>
                <TableInputCell
                  changedText={this.inputTextChanged}
                  row={row}
                  column={column}
                  alignment={alignValue}
                  text={inputText}
                  ref={(input) => {
                    this.state.refToInputs[stringId] = input;
                  }}
                />{' '}
              </td>,
            );
          } else {
            if (this.state !== undefined && this.state.textInTable !== undefined) {
              inputText = this.state.textInTable[stringId];
            }
            cell.push(
              <td className="td" key={cellId}>
                <TableInputCell
                  changedText={this.inputTextChanged}
                  row={row}
                  column={column}
                  text={inputText}
                  alignment="left"
                  ref={(input) => {
                    this.state.refToInputs[stringId] = input;
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
    return (
      <div className="table-container">
        <div className="table-size-container">
          <div className="table-form-container">
            <div className="table-caption-label-container">
              <TableCaption changeCaption={this.changeCaption} caption={caption} />
              <TableLabel changeLabel={this.changeLabel} label={label} />
              <ProjectName
                type="Table"
                name={projectName}
                projectNameChanged={(newName) => {
                  this.projectNameChanged(newName);
                }}
              />
            </div>
            <div className="table-rows-columns-container">
              <TableRows rowValue={this.inputRowsChanged} rows={rowsValue} />
              <TableColumns columnValue={this.inputColumnsChanged} columns={columnsValue} />
            </div>
          </div>
          <div className="table-button-symbols-container">
            <button className="basic-button " type="text" onClick={Table.resetApplicationState}>
              Start new table
            </button>
            <Symbols />
            {!this.state.workSaved && <div className="loader">Saving...</div>}
            {this.state.workSaved && <p>Work saved</p>}
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

export default withRouter(Table);
