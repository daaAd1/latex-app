import React from 'react';
import LatexCode from './LatexCode';
import Symbols from './Symbols';
import TableRows from './TableRows';
import TableColumns from './TableColumns';
import TableCaption from './TableCaption';
import TableLabel from './TableLabel';
import TableBorderCell from './TableBorderCell';
import TableAlignmentCell from './TableAlignmentCell';

/*  global localStorage: false, console: false, window: false */

class Table extends React.Component {
  static resetApplicationState() {
    window.localStorage.clear();
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

  static getInitialTextObject() {
    const textObject =
      JSON.parse(localStorage.getItem('table-textObject')) || this.initializeTextObject();
    return textObject;
  }

  static getInitialCaption() {
    const caption = localStorage.getItem('table-caption') || '';
    return caption;
  }

  static getInitialLabel() {
    const label = localStorage.getItem('table-label') || '';
    return label;
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: this.getInitialRowsState(),
      columns: this.getInitialColumnsState(),
      textInTable: this.getInitialTextObject(),
      caption: this.getInitialCaption(),
      label: this.getInitialLabel(),
      latexCode: '',
      refToBorders: {},
      refToAlignments: {},
      refToInputs: {},
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.inputRowsChanged = this.inputRowsChanged.bind(this);
    this.inputColumnsChanged = this.inputColumnsChanged.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.changeCaption = this.changeCaption.bind(this);
    this.changeLabel = this.changeLabel.bind(this);
    this.resetApplicationState = this.resetApplicationState.bind(this);
  }

  componentDidMount() {
    this.onMount(function callback() {
      this.setState(
        {
          textInTable: this.initializeTextObject(),
        },
        () => {
          this.setState({
            latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
          });
        },
      );
    });
  }

  initializeTextObject() {
    let initialObject = {};
    if (this.state !== undefined && this.state.textInTable !== undefined) {
      initialObject = this.state.textInTable;
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
        const position = row.toString() + column.toString();
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

  addTextToObject(row, column, text) {
    const key = row.toString() + column.toString();
    const obj = this.state.textInTable;
    obj[key] = text;
    this.setState({
      textInTable: obj,
    });
    localStorage.setItem('table-textObject', JSON.stringify(obj));
  }

  generateLatexCode(rows, columns) {
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
        let borderCell;
        if (this.state !== undefined) {
          borderCell = this.state.refToBorders[row.toString() + column.toString()];
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
          if (borderCell !== undefined) {
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
          textOnPosition = this.state.textInTable[row.toString() + column.toString()];
        }
        if (textOnPosition === '') {
          textOnPosition = '~';
        }
        if (column % 2 !== 0) {
          if (column === columns - 2) {
            rowText += textOnPosition;
          } else if (column === 1) {
            rowText += `        ${textOnPosition}   & `;
          } else {
            rowText += `${textOnPosition}   & `;
          }
        }
      }
      rowText += ' &#92;&#92;';
      let borderCell;
      let borderCell2;
      if (row % 2 !== 0) {
        if (this.state !== undefined) {
          if (row === 1) {
            if (this.state.refToBorders[(row - 1).toString() + 1] !== null) {
              borderCell = this.state.refToBorders[(row - 1).toString() + 1];
            }
            if (this.state.refToBorders[(row + 1).toString() + 1] !== null) {
              borderCell2 = this.state.refToBorders[(row + 1).toString() + 1];
            }
          } else if (this.state.refToBorders[(row + 1).toString() + 1] !== null) {
            borderCell = this.state.refToBorders[(row + 1).toString() + 1];
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
      coreTable.push(rowText);

      if (row === 0) {
        columnBorderText += '}';
        columnTable.push(columnBorderText);
      }
    }

    const captionLabelTable = [];
    if (this.state !== undefined) {
      captionLabelTable.push(`   &#92;caption{'${this.state.caption}}`);
      captionLabelTable.push(`   &#92;label{'${this.state.label}}`);
    } else {
      captionLabelTable.push('   &#92;caption{ }');
      captionLabelTable.push('   &#92;label{ }');
    }

    const finalString = [
      beginTable.join('\n'),
      columnTable.join('\n'),
      coreTable.join('\n'),
      endTabular,
      captionLabelTable.join('\n'),
      endTable,
    ].join('\n');

    return finalString;
  }

  inputRowsChanged(changedRowCount) {
    // have to call generateLatex as callback
    // because of setState asynchronity
    this.setState(
      {
        rows: changedRowCount * 2 + 1,
        textInTable: this.initializeTextObject(changedRowCount * 2 + 1, this.state.columns),
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(changedRowCount * 2 + 1, this.state.columns),
        });
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
        textInTable: this.initializeTextObject(this.state.rows, changedColumnCount * 2 + 1),
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, changedColumnCount * 2 + 1),
        });
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
    const border = this.state.refToBorders[row.toString() + column.toString()];
    let newBorderActiveValue = false;
    if (border != null) {
      newBorderActiveValue = !border.state.active;
    }
    if (direction === 'row') {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder += 1) {
        const borderCell = this.state.refToBorders[row.toString() + columnBorder.toString()];
        if (borderCell != null && borderCell.state.direction === 'row') {
          localStorage.setItem(`table-border-${row}${columnBorder}`, newBorderActiveValue);
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
        const borderCell = this.state.refToBorders[rowBorder.toString() + column.toString()];
        if (borderCell != null && borderCell.state.direction === 'column') {
          localStorage.setItem(`table-border-${rowBorder}${column}`, newBorderActiveValue);
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
        const borderCell = this.state.refToBorders[row.toString() + columnBorder.toString()];
        if (borderCell != null) {
          borderCell.setState({
            hover,
          });
        }
      }
    } else if (direction === 'column') {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder += 1) {
        const borderCell = this.state.refToBorders[rowBorder.toString() + column.toString()];
        if (borderCell != null) {
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
        this.state.refToInputs[row + columnId] !== undefined
      ) {
        const { alignment } = this.state.refToAlignments[columnId].state;
        const inputCell = this.state.refToInputs[row + columnId];
        inputCell.setState(
          {
            alignment,
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

  render() {
    const latexCode = <LatexCode code={this.state.latexCode} />;
    const rows = [];
    for (let row = -1; row < this.state.rows; row += 1) {
      const cell = [];
      for (let column = 0; column < this.state.columns; column += 1) {
        const cellId = `cell${row}-${column}`;
        const stringId = row.toString() + column.toString();
        const columnId = column.toString();
        if (row === -1) {
          if (column % 2 !== 0) {
            cell.push(
              <TableAlignmentCell
                key={cellId}
                column={column}
                onClick={this.alignCell(column)}
                ref={input => {
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
                direction="column"
                onMouseEnter={this.hoverBorder(row, column, 'column', true)}
                onMouseLeave={this.hoverBorder(row, column, 'column', false)}
                onClick={this.selectBorder(row, column, 'column')}
                ref={input => {
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
                onMouseEnter={this.hoverBorder(row, column, 'row', true)}
                onMouseLeave={this.hoverBorder(row, column, 'row', false)}
                onClick={this.selectBorder(row, column, 'row')}
                ref={input => {
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
                onClick={this.selectBorder(row, column, 'column', true)}
                onMouseEnter={this.hoverBorder(row, column, 'column')}
                onMouseLeave={this.hoverBorder(row, column, 'column', false)}
                row={row}
                column={column}
                direction="column"
                ref={input => {
                  this.state.refToBorders[stringId] = input;
                }}
              />,
            );
          } else {
            cell.push(
              <TableBorderCell
                key={cellId}
                onClick={this.selectBorder(row, column, 'row', true)}
                onMouseEnter={this.hoverBorder(row, column, 'row', true)}
                onMouseLeave={this.hoverBorder(row, column, 'row', false)}
                row={row}
                column={column}
                direction="row"
                ref={input => {
                  this.state.refToBorders[stringId] = input;
                }}
              />,
            );
          }
        } else if (column % 2 === 0) {
          cell.push(
            <TableBorderCell
              key={cellId}
              onClick={this.selectBorder(row, column, 'column')}
              onMouseEnter={this.hoverBorder(row, column, 'column', true)}
              onMouseLeave={this.hoverBorder(row, column, 'column', false)}
              ref={input => {
                this.state.refToBorders[stringId] = input;
              }}
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
            this.state.refToAlignments[columnId] !== null
          ) {
            if (this.state !== undefined && this.state.textInTable !== undefined) {
              inputText = this.state.textInTable[stringId];
            }
            const alignValue = this.state.refToAlignments[columnId].state.alignment;
            cell.push(
              <td className="td" key={cellId}>
                <TableInputCell
                  changedText={this.inputTextChanged}
                  row={row}
                  column={column}
                  alignment={alignValue}
                  text={inputText}
                  ref={input => {
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
                  ref={input => {
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
    return (
      <div className="table-container">
        <div className="table-size-container">
          <div className="table-form-container">
            <div className="table-caption-label-container">
              <TableCaption changeCaption={this.changeCaption} />
              <TableLabel changeLabel={this.changeLabel} />
            </div>
            <div className="table-rows-columns-container">
              <TableRows rowValue={this.inputRowsChanged} />
              <TableColumns columnValue={this.inputColumnsChanged} />
            </div>
          </div>
          <div className="table-button-symbols-container">
            <button className="basic-button " type="text" onClick={this.resetApplicationState}>
              Reset table
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

export default Table;
