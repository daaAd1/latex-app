import React from 'react';
import LatexCode from './LatexCode';
import Symbols from './Symbols';
import TaylorRow from './TaylorRow';

/*  global localStorage: false, console: false, window: false */

class TaylorDiagram extends React.Component {
  static resetApplicationState() {
    window.localStorage.clear();
    window.location.reload();
  }

  static getInitialRows() {
    const rows = localStorage.getItem('taylor-rows') || 2;
    return rows;
  }

  static initializeAdditionalArrowObject() {
    const arrowObject = {};
    for (let row = 1; row < 10; row += 1) {
      const position = row.toString();
      arrowObject[position] = false;
    }
    return arrowObject;
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: this.getInitialRows(),
      columnsObject: this.getInitialColumns(),
      latexCode: this.generateLatexCode(2),
      textObject: this.getInitialTextObject(),
      arrowsObject: this.getInitialArrowObject(),
      additionalArrowsObject: this.getInitialAdditionalArrowsObject(),
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.initializeTextObject = this.initializeTextObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.addArrowToObject = this.addArrowToObject.bind(this);
    this.deleteArrowFromObject = this.deleteArrowFromObject.bind(this);
    this.checkForArrow = this.checkForArrow.bind(this);
    this.initializeAdditionalArrowObject = this.initializeAdditionalArrowObject.bind(this);
    this.checkArrowObjectForArrows = this.checkArrowObjectForArrows.bind(this);
    this.onRowsChange = this.onRowsChange.bind(this);
    this.onColumnsChange = this.onColumnsChange.bind(this);
    this.cellTextChanged = this.cellTextChanged.bind(this);
  }

  componentDidMount() {
    this.onMount(function callback() {
      this.setState(
        {
          textObject: this.initializeTextObject(this.state.rows, 10),
          arrowsObject: this.initializeArrowObject(this.state.rows, 10),
          additionalArrowsObject: this.initializeAdditionalArrowObject(),
        },
        () => {
          this.setState({
            latexCode: this.generateLatexCode(this.state.rows),
          });
        },
      );
    });
  }

  onRowsChange(event) {
    if (event.target.value < 1) {
      this.setState(
        {
          rows: 1,
          textObject: this.initializeTextObject(1, 10),
          columnsObject: this.initializeColumnsObject(1),
        },
        () => {
          localStorage.setItem('taylor-rows', 1);
          this.setState({
            latexCode: this.generateLatexCode(),
          });
        },
      );
    } else if (event.target.value > 15) {
      this.setState(
        {
          rows: 15,
          textObject: this.initializeTextObject(15, 10),
          columnsObject: this.initializeColumnsObject(15),
        },
        () => {
          localStorage.setItem('taylor-rows', 15);
          this.setState({
            latexCode: this.generateLatexCode(),
          });
        },
      );
    } else {
      this.setState(
        {
          rows: event.target.value,
          textObject: this.initializeTextObject(event.target.value, 10),
          columnsObject: this.initializeColumnsObject(event.target.value),
        },
        () => {
          localStorage.setItem('taylor-rows', this.state.rows);
          this.setState({
            latexCode: this.generateLatexCode(),
          });
        },
      );
    }
  }

  onColumnsChange(row, columnsNewValue) {
    const key = row.toString();
    const obj = this.state.columnsObject;
    obj[key] = Number(columnsNewValue);
    this.setState(
      {
        columnsObject: obj,
      },
      () => {
        this.setState({
          latexCode: this.generateLatexCode(),
        });
      },
    );
    localStorage.setItem('taylor-columns', JSON.stringify(obj));
  }

  getInitialColumns() {
    const columns =
      JSON.parse(localStorage.getItem('taylor-columns')) || this.initializeColumnsObject(2);
    return columns;
  }

  getInitialTextObject() {
    const textObject =
      JSON.parse(localStorage.getItem('taylor-text-object')) || this.initializeTextObject(2, 10);
    return textObject;
  }

  getInitialArrowObject() {
    const arrowObject =
      JSON.parse(localStorage.getItem('taylor-arrow-object')) || this.initializeArrowObject(2, 10);
    return arrowObject;
  }

  getInitialAdditionalArrowsObject() {
    const additionalArrowObject =
      JSON.parse(localStorage.getItem('taylor-additional-arrow-object')) ||
      this.initializeAdditionalArrowObject();
    return additionalArrowObject;
  }

  initializeColumnsObject(rows) {
    let columnsObject;
    if (this.state !== undefined && this.state.columnsObject !== undefined) {
      columnsObject = this.state;
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

  initializeTextObject(rows, maxColumns) {
    let textObject;
    if (this.state !== undefined && this.state.textObject !== undefined) {
      textObject = this.state;
    } else {
      textObject = {};
    }
    for (let row = 1; row <= rows; row += 1) {
      for (let column = 1; column <= maxColumns; column += 1) {
        const position = row.toString() + column.toString();
        if (
          this.state !== undefined &&
          this.state.textObject !== undefined &&
          this.state.textObject[position] !== undefined
        ) {
          textObject[position] = this.state.textObject[position];
        } else {
          textObject[position] = '';
        }
      }
    }
    return textObject;
  }

  initializeArrowObject(rows, maxColumns) {
    let arrowObject;
    if (this.state !== undefined && this.state.arrowObject !== undefined) {
      arrowObject = this.state;
    } else {
      arrowObject = {};
    }
    for (let row = 1; row <= rows; row += 1) {
      for (let column = 1; column <= maxColumns; column += 1) {
        const position = row.toString() + column.toString();
        if (
          this.state !== undefined &&
          this.state.arrowsObject !== undefined &&
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
            tex2t: '',
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

  addTextToObject(text, row, column) {
    const key = row.toString() + column.toString();
    const obj = this.state.textObject;
    obj[key] = text;
    this.setState({
      textObject: obj,
    });
    localStorage.setItem('taylor-text-object', JSON.stringify(obj));
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
      () => {
        this.setState({
          latexCode: this.generateLatexCode(this.state.rows, this.state.columns),
        });
      },
    );
    localStorage.setItem('taylor-arrow-object', JSON.stringify(obj));
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
    localStorage.setItem('taylor-arrow-object', JSON.stringify(obj));
  }

  generateLatexCode(rows) {
    this.checkArrowObjectForArrows();
    const beginDiagram = ['&#92;begin{diagram}'];
    const endDiagram = ['&#92;end{diagram}'];
    const coreDiagram = [];
    let numOfRows;
    if (this.state !== undefined) {
      numOfRows = this.state.rows;
    } else {
      numOfRows = rows;
    }
    for (let row = 1; row <= numOfRows; row += 1) {
      let rowText = '';
      let numOfColumns = 3;
      if (this.state !== undefined && this.state.columnsObject !== undefined) {
        numOfColumns = this.state.columnsObject[row];
      }
      for (let column = 1; column <= numOfColumns; column += 1) {
        const position = row.toString() + column.toString();
        if (this.state !== undefined && this.state.textObject !== undefined) {
          if (
            this.state.arrowsObject !== undefined &&
            this.state.arrowsObject[position] !== undefined &&
            this.state.arrowsObject[position].l.active
          ) {
            const arrowType = this.state.arrowsObject[position].l.type;
            rowText += ` & &#92;l${arrowType}`;
            const arrowText = this.state.arrowsObject[position].l.text;
            if (arrowText !== '') {
              rowText += `^{'${arrowText}}`;
            }
            const arrowText2 = this.state.arrowsObject[position].l.text2;
            if (arrowText2 !== '') {
              rowText += `_{${arrowText2}}`;
            }
          }
          if (column === 1) {
            rowText += `   ${this.state.textObject[position]}`;
          } else {
            rowText += ` &   ${this.state.textObject[position]}`;
          }
          // let positionR = (row - 1).toString() + column.toString();
          const positionNextOne = row.toString() + (column + 1).toString();
          if (
            this.state.additionalArrowsObject !== undefined &&
            this.state.arrowsObject !== undefined &&
            this.state.arrowsObject[position] !== undefined &&
            !this.state.arrowsObject[position].r.active &&
            this.state.arrowsObject[positionNextOne] !== undefined &&
            !this.state.arrowsObject[positionNextOne].l.active
          ) {
            if (this.state.additionalArrowsObject[column.toString()]) {
              rowText += ' & ';
            }
          }
          if (
            this.state.arrowsObject !== undefined &&
            this.state.arrowsObject[position] !== undefined &&
            this.state.arrowsObject[position].r.active
          ) {
            const arrowType = this.state.arrowsObject[position].r.type;
            rowText += ` & &#92;r${arrowType}`;
            const arrowText = this.state.arrowsObject[position].r.text;
            if (arrowText !== '') {
              rowText += `^{${arrowText}}`;
            }
            const arrowText2 = this.state.arrowsObject[position].r.text2;
            if (arrowText2 !== '') {
              rowText += `_{${arrowText2}}`;
            }
          }
        }
        if (column === numOfColumns) {
          rowText += ' &#92;&#92;\n';
          let isAnyArrowActive = false;
          for (let currentColumn = 1; currentColumn <= numOfColumns; currentColumn += 1) {
            const newPosition = row.toString() + currentColumn.toString();
            const positionOneLevelDown = (row + 1).toString() + currentColumn.toString();
            const newPositionLeft = row.toString() + (currentColumn - 1).toString();
            const newPositionRight = row.toString() + (currentColumn + 1).toString();
            if (
              this.state !== undefined &&
              this.state.arrowsObject !== undefined &&
              this.state.arrowsObject[newPosition] !== undefined
            ) {
              if (
                this.state.arrowsObject[newPosition].ld.active ||
                this.state.arrowsObject[newPosition].d.active ||
                this.state.arrowsObject[newPosition].rd.active
              ) {
                rowText += this.checkForArrow('ld', newPosition);
                rowText += this.checkForArrow('d', newPosition);
                rowText += this.checkForArrow('rd', newPosition);
                isAnyArrowActive = true;
              }
            }
            if (
              this.state !== undefined &&
              this.state.arrowsObject !== undefined &&
              this.state.arrowsObject[positionOneLevelDown] !== undefined
            ) {
              if (
                this.state.arrowsObject[positionOneLevelDown].lu.active ||
                this.state.arrowsObject[positionOneLevelDown].u.active ||
                this.state.arrowsObject[positionOneLevelDown].ru.active
              ) {
                if (
                  this.state !== undefined &&
                  this.state.arrowsObject !== undefined &&
                  this.state.arrowsObject[newPosition] !== undefined &&
                  !this.state.arrowsObject[newPosition].d.active
                ) {
                  rowText += this.checkForArrow('u', positionOneLevelDown);
                }
                if (
                  this.state !== undefined &&
                  this.state.arrowsObject !== undefined &&
                  this.state.arrowsObject[newPositionRight] !== undefined &&
                  !this.state.arrowsObject[newPositionRight].ld.active
                ) {
                  rowText += this.checkForArrow('ru', positionOneLevelDown);
                }
                if (
                  this.state !== undefined &&
                  this.state.arrowsObject !== undefined &&
                  this.state.arrowsObject[newPositionLeft] !== undefined &&
                  !this.state.arrowsObject[newPositionLeft].ld.active
                ) {
                  rowText += this.checkForArrow('lu', positionOneLevelDown);
                }
                isAnyArrowActive = true;
              }
            }
          }
          if (!isAnyArrowActive) {
            rowText = rowText.replace(/&#92;&#92;\n/g, ' ');
          }
        }
      }
      if (row !== numOfRows) {
        rowText += ' &#92;&#92;';
      }
      coreDiagram.push(rowText);
    }
    return [beginDiagram, coreDiagram.join('\n'), endDiagram].join('\n');
  }

  checkForArrow(direction, position) {
    let rowText = '';
    if (
      this.state.arrowsObject[position] !== undefined &&
      this.state.arrowsObject[position][direction].active
    ) {
      const arrowType = this.state.arrowsObject[position][direction].type;
      rowText += ` & &#92;${direction}${arrowType}`;
      const arrowText = this.state.arrowsObject[position][direction].text;
      if (arrowText !== '') {
        rowText += `^{${arrowText}}`;
      }
      const arrowText2 = this.state.arrowsObject[position][direction].text2;
      if (arrowText2 !== '') {
        rowText += `_{${arrowText2}}`;
      }
    }
    return rowText;
  }

  // checks any occurences of "r", "rd", "ru", "l", "ld", "lu" arrows
  checkArrowObjectForArrows() {
    let numOfRows = 2;
    if (this.state !== undefined) {
      numOfRows = this.state.rows;
    }
    const numOfColumns = 10;
    for (let column = 1; column < numOfColumns; column += 1) {
      for (let row = 1; row <= numOfRows; row += 1) {
        const position = row.toString() + column.toString();
        const positionOneColumnAway = row.toString() + (column + 1).toString();
        if (
          this.state !== undefined &&
          this.state.arrowsObject !== undefined &&
          this.state.arrowsObject[position] !== undefined
        ) {
          if (
            this.state.arrowsObject[position].r.active ||
            this.state.arrowsObject[position].rd.active ||
            this.state.arrowsObject[position].ru.active
          ) {
            const key = column.toString();
            const obj = this.state.additionalArrowsObject;
            obj[key] = true;
            this.setState({
              additionalArrowsObject: obj,
            });
            localStorage.setItem('taylor-additional-arrow-object', JSON.stringify(obj));
          }
          if (
            this.state.arrowsObject[positionOneColumnAway].l.active ||
            this.state.arrowsObject[positionOneColumnAway].ld.active ||
            this.state.arrowsObject[positionOneColumnAway].lu.active
          ) {
            const key = column.toString();
            const obj = this.state.additionalArrowsObject;
            obj[key] = true;
            this.setState({
              additionalArrowsObject: obj,
            });
            localStorage.setItem('taylor-additional-arrow-object', JSON.stringify(obj));
          }
        }
      }
    }
  }

  cellTextChanged(text, row, column) {
    this.addTextToObject(text, row, column);
    this.setState({
      latexCode: this.generateLatexCode(),
    });
  }

  arrowStateChanged(row, column, direction, text, text2, type) {
    this.addArrowToObject(row, column, direction, text, text2, type);
    this.setState({
      latexCode: this.generateLatexCode(),
    });
  }

  arrowDeleted(row, column, direction) {
    this.deleteArrowFromObject(row, column, direction);
    this.setState({
      latexCode: this.generateLatexCode(),
    });
  }

  render() {
    const latexCode = <LatexCode code={this.state.latexCode} />;
    const rows = [];
    rows.push(
      <div className="taylor-diagram-size-container" key="first-row-key">
        <div className="taylor-rows-count">
          <div className="taylor-size-container">
            <label htmlFor="taylor-rows">Rows: {this.state.rows}</label>
            <div>
              <input
                id="taylor-rows"
                type="range"
                min="1"
                max="15"
                value={this.state.rows}
                onChange={this.onRowsChange}
              />
            </div>
          </div>
          <Symbols />
          <button className="basic-button" type="text" onClick={this.resetApplicationState}>
            Reset taylor
          </button>
        </div>
        <hr className="taylor-separating-line" />
      </div>,
    );
    for (let row = 1; row <= this.state.rows; row += 1) {
      rows.push(
        <TaylorRow
          rowText={this.state.textObject}
          cellTextChanged={this.cellTextChanged}
          key={row}
          row={row}
          arrowDeleted={this.arrowDeleted(row)}
          arrowStateChanged={this.arrowStateChanged(row)}
          onColumnsChange={this.onColumnsChange(row)}
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

export default TaylorDiagram;
