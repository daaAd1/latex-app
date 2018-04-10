import React, { } from "react";
import LatexCode from "./LatexCode";
import Arrow from "./Arrow";
import TextareaAutosize from 'react-autosize-textarea';

class TaylorDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 2,
      columnsObject: this.initializeColumnsObject(2),
      latexCode: this.generateLatexCode(2),
      textObject: this.initializeTextObject(2, 10),
      arrowsObject: this.initializeArrowObject(2,10),
      additionalArrowsObject: this.initializeAdditionalArrowObject(),
    }

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.initializeTextObject = this.initializeTextObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.addArrowToObject = this.addArrowToObject.bind(this);
    this.deleteArrowFromObject = this.deleteArrowFromObject.bind(this);
    this.checkForArrow = this.checkForArrow.bind(this);
    this.initializeAdditionalArrowObject = this.initializeAdditionalArrowObject.bind(this);
    this.checkArrowObjectForArrows = this.checkArrowObjectForArrows.bind(this);
  };

  initializeColumnsObject(rows) {
    let columnsObject;
    if (this.state !== undefined && this.state.columnsObject !== undefined ) {
      columnsObject = this.state.columnsObject;
    } 
    else {
      columnsObject = {};
    }
    for (let row = 1; row <= rows; row++) {
      let position = row.toString();
        if (this.state !== undefined && this.state.columnsObject !== undefined 
          && this.state.columnsObject[position] !== undefined) {
            columnsObject[position] = this.state.columnsObject[position];
        } 
        else {
            columnsObject[position] = 3;
        }
    }
    return columnsObject;
  }

  initializeTextObject(rows, maxColumns) {
    let textObject;
    if (this.state !== undefined && this.state.textObject !== undefined ) {
      textObject = this.state.textObject;
    } 
    else {
      textObject = {};
    }
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= maxColumns;  column++) {
        let position = row.toString() + column.toString();
        if (this.state !== undefined && this.state.textObject !== undefined 
          && this.state.textObject[position] !== undefined) {
            textObject[position] = this.state.textObject[position];
          } 
          else {
              textObject[position] = '';
          }
      }
    }
    return textObject;
  }

  initializeArrowObject(rows, maxColumns) {
    let arrowObject;
    if (this.state !== undefined && this.state.arrowObject !== undefined ) {
      arrowObject = this.state.arrowObject;
    } 
    else {
      arrowObject = {};
    } 
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= maxColumns;  column++) {
        let position = row.toString() + column.toString();
        if (this.state !== undefined && this.state.arrowObject !== undefined 
          && this.state.arrowObject[position] !== undefined) {
            arrowObject[position] = this.state.arrowObject[position];
          } 
          else {
            arrowObject[position] = {};
            arrowObject[position].lu = {active: false, text: "", text2: "",type: ""};
            arrowObject[position].u = {active: false, text: "", text2: "", type: ""};
            arrowObject[position].ru = {active: false, text: "", text2: "", type: ""};
            arrowObject[position].l = {active: false, text: "", text2: "", type: ""};
            arrowObject[position].r = {active: false, text: "", text2: "", type: ""};
            arrowObject[position].ld = {active: false, text: "", tex2t: "", type: ""};
            arrowObject[position].d = {active: false, text: "", text2: "", type: ""};
            arrowObject[position].rd = {active: false, text: "", text2: "", type: ""};
          }
      }
    }
    return arrowObject;
  }
 
  addTextToObject(text, row, column) {
    var key = (row.toString()) + (column.toString());
    var obj = this.state.textObject;
    obj[key] = text;
    this.setState({
      textObject: obj
    }); 
  }
  
  addArrowToObject(row, column, direction, text, text2, type) {
    let key = (row.toString()) + (column.toString());
    let obj = this.state.arrowsObject;
    obj[key][direction].active = true;
    obj[key][direction].text = text;
    obj[key][direction].text2 = text2;
    obj[key][direction].type = type;
    this.setState({
      arrowsObject: obj,
    }, () => {
      this.setState ({ 
        latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    })});
  }

  deleteArrowFromObject(row, column, direction) {
    let key = (row.toString()) + (column.toString());
    let obj = this.state.arrowsObject;
    obj[key][direction].active = false;
    this.setState({
      arrowsObject: obj
    }, () => {
      this.setState ({ 
        latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    })}); 
  }

  generateLatexCode(rows) {
    this.checkArrowObjectForArrows();
    let beginDiagram = [
      "&#92;begin{diagram}",
    ];
    let endDiagram = [
      "&#92;end{diagram}",
    ];
    let coreDiagram = [];
    let numOfRows;
    if (this.state !== undefined) {
      numOfRows = this.state.rows;
    }
    else {
      numOfRows = rows;
    }
    for (let row = 1; row <= numOfRows; row++) {
      let rowText = "";
      let numOfColumns = 3;
      if (this.state !== undefined && this.state.columnsObject !== undefined) {
        numOfColumns = this.state.columnsObject[row];
      }
      for (let column = 1; column <= numOfColumns;  column++) {
        let position = row.toString() + column.toString();
        if (this.state !== undefined && this.state.textObject !== undefined) {
            if (this.state.arrowsObject !== undefined &&
              this.state.arrowsObject[position] !== undefined && 
            this.state.arrowsObject[position]["l"].active) {
              let arrowType = this.state.arrowsObject[position]["l"].type;
              rowText += " & &#92;l" + arrowType;
              let arrowText = this.state.arrowsObject[position]["l"].text;
              if (arrowText !== "") {
                rowText += "^{" + arrowText + "}";
              }
              let arrowText2 = this.state.arrowsObject[position]["l"].text2;
              if (arrowText2 !=="") {
                rowText += "_{" + arrowText2 + "}";
              }
            }
            if (column === 1) {
              rowText += "   " + this.state.textObject[position];
            }
            else {
              rowText += " & " + this.state.textObject[position];
            }
            //let positionR = (row - 1).toString() + column.toString();
            let positionNextOne = row.toString() + (column+1).toString();
            if (this.state.additionalArrowsObject !== undefined 
          && this.state.arrowsObject !== undefined
          && this.state.arrowsObject[position] !== undefined
          && !this.state.arrowsObject[position]["r"].active
          && this.state.arrowsObject[positionNextOne] !== undefined
          && !this.state.arrowsObject[positionNextOne]["l"].active) {
            if (this.state.additionalArrowsObject[column.toString()]) {
                rowText += " & ";
              }
            }
            if (this.state.arrowsObject !== undefined &&
              this.state.arrowsObject[position] !== undefined && 
              this.state.arrowsObject[position]["r"].active) {
                let arrowType = this.state.arrowsObject[position]["r"].type;
                rowText += " & &#92;r" + arrowType;
                let arrowText = this.state.arrowsObject[position]["r"].text;
                if (arrowText !== "") {
                  rowText += "^{" + arrowText + "}";
                }
                let arrowText2 = this.state.arrowsObject[position]["r"].text2;
              if (arrowText2 !=="") {
                rowText += "_{" + arrowText2 + "}";
              }
          }
        }
        if (column === numOfColumns) {
          rowText += " &#92;&#92;\n";
          let isAnyArrowActive = false;
          for (let currentColumn = 1; currentColumn <= numOfColumns; currentColumn++) {
            let newPosition = row.toString() + currentColumn.toString();
            let positionOneLevelDown = (row+1).toString() + currentColumn.toString();
            let newPositionLeft = row.toString() + (currentColumn-1).toString();
            let newPositionRight = row.toString() + (currentColumn+1).toString();
            if (this.state !== undefined && this.state.arrowsObject !== undefined
            && this.state.arrowsObject[newPosition] !== undefined) {
              if (this.state.arrowsObject[newPosition]["ld"].active 
              || this.state.arrowsObject[newPosition]["d"].active 
              || this.state.arrowsObject[newPosition]["rd"].active) {
                rowText += this.checkForArrow("ld", newPosition);
                rowText += this.checkForArrow("d", newPosition);
                rowText += this.checkForArrow("rd", newPosition);
                isAnyArrowActive = true;
              }
            }
            if (this.state !== undefined && this.state.arrowsObject !== undefined
              && this.state.arrowsObject[positionOneLevelDown] !== undefined) {
              if (this.state.arrowsObject[positionOneLevelDown]["lu"].active 
              || this.state.arrowsObject[positionOneLevelDown]["u"].active 
              || this.state.arrowsObject[positionOneLevelDown]["ru"].active) {
                if (this.state !== undefined && this.state.arrowsObject !== undefined
                  && this.state.arrowsObject[newPosition] !== undefined
                  && !this.state.arrowsObject[newPosition]["d"].active) {
                  rowText += this.checkForArrow("u", positionOneLevelDown);
                }
                if (this.state !== undefined && this.state.arrowsObject !== undefined
                    && this.state.arrowsObject[newPositionRight] !== undefined
                    && !this.state.arrowsObject[newPositionRight]["ld"].active) {
                  rowText += this.checkForArrow("ru", positionOneLevelDown);
                  console.log(rowText)
                }
                if (this.state !== undefined && this.state.arrowsObject !== undefined
                  && this.state.arrowsObject[newPositionLeft] !== undefined
                  && !this.state.arrowsObject[newPositionLeft]["ld"].active) {
                    rowText += this.checkForArrow("lu", positionOneLevelDown);
                  }
                isAnyArrowActive = true;
              }
            }
          }
          if (!isAnyArrowActive) {
            rowText = rowText.replace(/&#92;&#92;\n/g, " ");
          }    
        }
      }
      if (row !== numOfRows) {
        rowText += " &#92;&#92;";
      }
      coreDiagram.push(rowText);
    }
    return [
      beginDiagram,
      coreDiagram.join("\n"),
      endDiagram
    ].join("\n");
  }

  checkForArrow(direction, position) {
    let rowText = "";
    if (this.state.arrowsObject[position] !== undefined && 
      this.state.arrowsObject[position][direction].active) {
      let arrowType = this.state.arrowsObject[position][direction].type;
      rowText += " & &#92;" + direction + arrowType;
      let arrowText = this.state.arrowsObject[position][direction].text;
      if (arrowText !== "") {
        rowText += "^{" + arrowText + "}";
      }
      let arrowText2 = this.state.arrowsObject[position][direction].text2;
      if (arrowText2 !=="") {
        rowText += "_{" + arrowText2 + "}";
      }
    }
    return rowText;
  }

  initializeAdditionalArrowObject() {
    let arrowObject = {};
    for (let row = 1; row < 10; row++) {
      let position = row.toString();
        arrowObject[position] = false;
    }
    return arrowObject;
  }

  // checks any occurences of "r", "rd", "ru", "l", "ld", "lu" arrows
  checkArrowObjectForArrows() {
    let numOfRows = 2;
    if (this.state !== undefined) {
      numOfRows = this.state.rows;
    }
    let numOfColumns = 10;
    for (let column = 1; column < numOfColumns; column++) {
      for (let row = 1; row <= numOfRows; row++) {
        let position = row.toString() + column.toString();
        let positionOneColumnAway = row.toString() + (column+1).toString();
        if (this.state !== undefined && this.state.arrowsObject !== undefined
        && this.state.arrowsObject[position] !== undefined) {
          if (this.state.arrowsObject[position]["r"].active
          || this.state.arrowsObject[position]["rd"].active
        || this.state.arrowsObject[position]["ru"].active) {
            let key = column.toString();
            let obj = this.state.additionalArrowsObject;
            obj[key] = true;
            this.setState({
              additionalArrowsObject: obj
            });
          }
          if (this.state.arrowsObject[positionOneColumnAway]["l"].active
          || this.state.arrowsObject[positionOneColumnAway]["ld"].active 
          || this.state.arrowsObject[positionOneColumnAway]["lu"].active) {
            let key = column.toString();
            let obj = this.state.additionalArrowsObject;
            obj[key] = true;
            this.setState({
              additionalArrowsObject: obj
            });
          }
        }
      }
    }
  }

  onRowsChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1,
        textObject: this.initializeTextObject(1, 10),
        columnsObject: this.initializeColumnsObject(1),
      }, () => {
        this.setState ({ 
          latexCode: this.generateLatexCode()
      })});
    }
    else if (event.target.value > 15) {
      this.setState({
        rows: 15,
        textObject: this.initializeTextObject(15,10),
        columnsObject: this.initializeColumnsObject(15),
      }, () => {
        this.setState ({ 
          latexCode: this.generateLatexCode()
      })});
    }
    else {
      this.setState({
        rows: event.target.value,
        textObject: this.initializeTextObject(event.target.value, 10),
        columnsObject: this.initializeColumnsObject(event.target.value),
      }, () => {
        this.setState ({ 
          latexCode: this.generateLatexCode()
      })});
    }
  }

  onColumnsChange(row, columnsNewValue) {
    let key = row.toString();
    let obj = this.state.columnsObject;
    obj[key] = Number(columnsNewValue);
    this.setState({
      columnsObject: obj
    }, () => {
      this.setState ({ 
        latexCode: this.generateLatexCode()
    })});
  }

  cellTextChanged(text, row, column) {
    this.addTextToObject(text, row, column);
    this.setState ({ 
      latexCode: this.generateLatexCode()
    });
  }

  arrowStateChanged(row, column, direction, text, text2, type) {
    this.addArrowToObject(row, column, direction, text, text2, type);
    this.setState ({ 
      latexCode: this.generateLatexCode()
    });
  }

  arrowDeleted(row, column, direction) {
    this.deleteArrowFromObject(row, column, direction);
    this.setState ({ 
      latexCode: this.generateLatexCode()
    });
  }

  render() {
    let latexCode = <LatexCode code={this.state.latexCode}></LatexCode>;
    let rows = [];
    rows.push(
    <div key={"first-row-key"}>
      Rows:
      <input type="number" min="1" max="15" value={this.state.rows}
       onChange={this.onRowsChange.bind(this)}/>
    </div>
    );
    for (let row = 1; row <= this.state.rows; row++ ) {
        rows.push(<Row cellTextChanged={this.cellTextChanged.bind(this)}
         key={row} row={row} arrowDeleted={this.arrowDeleted.bind(this, row)}
         arrowStateChanged={this.arrowStateChanged.bind(this, row)}
          onColumnsChange={this.onColumnsChange.bind(this, row)}> </Row>);
    }
    return (
      <div>
        {rows}
        {latexCode}
      </div>
    );
  }
}

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      columns: 3,
    }
  };

  onColumnsChange(event) {
    if (event.target.value < 1) {
      this.setState({
        columns: 1
      });
      this.props.onColumnsChange(1);
    }
    else if (event.target.value > 10) {
      this.setState({
        columns: 10
      });
      this.props.onColumnsChange(10);
    }
    else {
      this.setState({
        columns: event.target.value
      });
      this.props.onColumnsChange(event.target.value);
    }
  }

  arrowStateChanged(column, direction, text, text2, type) {
    this.props.arrowStateChanged(column, direction, text, text2, type);
  }

  arrowDeleted(column, direction) {
    this.props.arrowDeleted(column, direction);
  }

  render() {
    let cells = [];
    
    for (let column  = 1; column <= this.state.columns; column++) {
        cells.push(
        <div key={column} className="cellArrows">
            <Cell arrowStateChanged={this.arrowStateChanged.bind(this, column)}
            arrowDeleted={this.arrowDeleted.bind(this, column)}
            row={this.state.row} column={column} 
            cellTextChanged={this.props.cellTextChanged}/>
        </div>)
    }
    return (
      <div className="taylor-row">
        Columns: <input type="number" min="1" max="10" value={this.state.columns} 
    onChange={this.onColumnsChange.bind(this)}/>
        {cells}
      </div>
    );
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      cellText: "",
    };
  }

  cellTextChanged(event) {
    this.setState({
      cellText: event.target.value,
    });
    this.props.cellTextChanged(event.target.value, this.state.row, this.state.column);
  }

  arrowStateChanged(direction, text, text2, type) {
    this.props.arrowStateChanged(direction, text, text2, type);
  }

  arrowDeleted(direction) {
    this.props.arrowDeleted(direction);
  }

  render() {
    return (
      <div>
        <div className="arrowButtons">
              <Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="lu" /><Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="u" />
              <Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="ru" /><Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="l" />
              <Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="r" /><Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="ld" />
              <Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column}  arrowDirection="d" /><Arrow arrowDeleted={this.arrowDeleted.bind(this)} arrowActivated={this.arrowStateChanged.bind(this)} row={this.state.row} column={this.state.column} arrowDirection="rd" />
        </div>
        <TextareaAutosize type="text" value={this.state.cellText}
        className="input-textarea"
        onChange={this.cellTextChanged.bind(this)}/>        
      </div>
    );
  }
}
   
  export default TaylorDiagram;