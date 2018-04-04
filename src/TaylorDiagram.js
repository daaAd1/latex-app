import React, { } from "react";
import LatexCode from "./LatexCode";
import Arrow from "./Arrow";

class TaylorDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 2,
      columns: 10,
      latexCode: this.generateLatexCode(),
      cellText: this.initializeTextObject(2, 10),
    }

    this.initializeTextObject = this.initializeTextObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
  };

  initializeTextObject(rows, maxColumns) {
    let textObject;
    if (this.state !== undefined && this.state.cellText !== undefined ) {
      textObject = this.state.cellText;
    } 
    else {
      textObject = {};
    }
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= maxColumns;  column++) {
        let position = row.toString() + column.toString();
        if (this.state !== undefined && this.state.cellText !== undefined 
          && this.state.cellText[position] !== undefined) {
            textObject[position] = this.state.cellText[position];
          } 
          else {
              textObject[position] = '';
          }
      }
    }
    return textObject;
  }

  addTextToObject(text, row, column) {
    var key = (row.toString()) + (column.toString());
    var obj = this.state.cellText;
    obj[key] = text;
    this.setState({
      cellText: obj
    }); 
    console.log(this.state.cellText)
  }

  generateLatexCode() {
    //for (let row = 0; row < this.state.rows; row++) {
      //for (let column = 0; column < 10;  column++) {

    //  }
    //}
  }

  onRowsChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1,
        textObject: this.initializeTextObject(1, 10),
      });
    }
    else if (event.target.value > 20) {
      this.setState({
        rows: 20,
        textObject: this.initializeTextObject(20, 10),
      });
    }
    else {
      this.setState({
        rows: event.target.value,
        textObject: this.initializeTextObject(event.target.value, 10),
      });
    }
  }

  onColumnsChange(columnsNewValue) {
    this.setState({
      columns: columnsNewValue,
      //textObject: this.initializeTextObject(event.target.value, 10),
    });
  }

  cellTextChanged(text, row, column) {
    this.addTextToObject(text, row, column);
  }

  render() {
    let rows = [];
    rows.push(
    <div key={"first-row-key"}>
      Rows:
      <input type="number" value={this.state.rows}
       onChange={this.onRowsChange.bind(this)}/>
    </div>
    );
    for (let row = 1; row <= this.state.rows; row++ ) {
        rows.push(<Row cellTextChanged={this.cellTextChanged.bind(this)}
         key={row} row={row}
          onColumnsChange={this.onColumnsChange.bind(this)}> </Row>);
    }
    return (
      <div>
        {rows}
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

  render() {
    let cells = [];
    
    for (let column  = 1; column <= 
      this.state.columns; column++) {
        cells.push(
        <div key={column} className="cellArrows">
            <Cell row={this.state.row} column={column} 
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

  render() {
    return (
      <div>
        <div className="arrowButtons">
              <Arrow row={this.state.row} column={this.state.column} arrowDirection="lu" /><Arrow row={this.state.row} column={this.state.column} arrowDirection="u" />
              <Arrow row={this.state.row} column={this.state.column} arrowDirection="ru" /><Arrow row={this.state.row} column={this.state.column} arrowDirection="l" />
              <Arrow row={this.state.row} column={this.state.column} arrowDirection="r" /><Arrow row={this.state.row} column={this.state.column} arrowDirection="ld" />
              <Arrow row={this.state.row} column={this.state.column}  arrowDirection="d" /><Arrow row={this.state.row} column={this.state.column} arrowDirection="r" />
        </div>
        <input type="text" value={this.state.cellText}
        onChange={this.cellTextChanged.bind(this)}/>        
      </div>
    );
  }
}
   
  export default TaylorDiagram;