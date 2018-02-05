import React, { Component } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
//import logo from './logo.svg';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

    this.sizeChanged = this.sizeChanged.bind(this);
  }

  sizeChanged() {

  }

  render() {
    return (
      <div>
        <Table changeTableSize={this.sizeChanged}> </Table>
      </div>
    );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 11, 
      columns: 11,
      copied: false,
      textInTable: this.initializeTextObject(11, 11),
      latexCode: this.generateLatexCode(11, 11),
      refToBorders: {},
      value: ''
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.inputRowsChanged = this.inputRowsChanged.bind(this);
    this.inputColumnsChanged = this.inputColumnsChanged.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateDangerousHTML = this.generateDangerousHTML.bind(this);
  }

  initializeTextObject(rows, columns) {
    let initialObject = {};
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (this.state !== undefined && this.state.textInTable !== undefined 
          && this.state.textInTable[row.toString() + column.toString()] !== undefined) {
            initialObject[row.toString() + column.toString()]
              = this.state.textInTable[row.toString() + column.toString()];
          } 
          else {
            //if (!(row % 2 === 0) || !(column & 2 === 0)) {
              initialObject[row.toString() + column.toString()] = '';
            //}
          }
      }
    }
    return initialObject;
  }

  addTextToObject(row, column, text) {
    var key = (row.toString()) + (column.toString());
    var obj = this.state.textInTable;
    obj[key] = text;
    this.setState({
      textInTable: obj
    });
  }

  generateLatexCode(rows, columns) {
    let beginTable = [
      " &#92;begin{table} "
    ];

    let columnTable = [];
    let columnBorderText = "   &#92;begin{tabular}{";
    let coreTable = [];

    for (let row = 0; row < rows; row++) {
      let rowText = '';
      for (let column = 0; column < columns; column++) {
        let borderCell;
        if (this.state !== undefined) {
          borderCell = this.state.refToBorders[row.toString() + column.toString()];
        }

        if (column % 2 === 0  && row === 0) {
          if (borderCell !== undefined) {
            if (borderCell.state.active === true) {
              if (column === columns -1 ) {
                columnBorderText += "|"
              }
              else {
                columnBorderText += "|l"
              }
            }
            else if (column !== columns - 1) {
              columnBorderText += "l"
            }
          }
          else if (column !== columns - 1) {
            columnBorderText += "l"
          }
        }
        
        let textOnPosition = "";
        if (this.state !== undefined) {
          textOnPosition =  this.state.textInTable[row.toString() + column.toString()];
        }
        if (textOnPosition === '') {
          textOnPosition = '~'
        }
        if (column % 2 !== 0) {
          if (column === columns - 2) {
            rowText += textOnPosition;
          }
          else if (column === 1) {
            rowText  += "      " + textOnPosition + " & ";
          }
          else {
            rowText  += textOnPosition + " & ";
          }
        }
      }
      rowText += " &#92;&#92;";

      if (row % 2 !== 0) {
        let borderCell;
        let borderCell2;
        if (this.state !== undefined) {
          if (row === 1) {
            borderCell = this.state.refToBorders[(row - 1).toString() + 1];
            borderCell2 = this.state.refToBorders[(row + 1).toString() + 1];
          }
          else {
            borderCell = this.state.refToBorders[(row + 1).toString() + 1];
          }
          
        }
        if (row === 1) {
          if (borderCell !== undefined && borderCell.state.active === true) {
              if (borderCell2 != undefined && borderCell2.state.active === true) {
                let currentRowText = rowText;
                rowText = "      &#92;hline\n";
                rowText += currentRowText + " &#92;hline";
              }
              else {
                let currentRowText = rowText;
                rowText = "      &#92;hline\n";
                rowText += currentRowText;
              }
            }
            else {
              if (borderCell2 != undefined && borderCell2.state.active === true) {
                rowText += " &#92;hline";
              }
            }
        }
        else {
          if (borderCell !== undefined && borderCell.state.active === true) {
            rowText += " &#92;hline";
          }
        }
        coreTable.push(rowText);
      }
      
      if (row === 0) {
        columnBorderText += "}"
        columnTable.push(columnBorderText)
      }
    }
  
    let endTable = [
      "   &#92;end{tabular} ",
        " &#92;end{table} "
    ];

    if (this.state !== undefined && this.state.copied !== undefined ) {
      this.setState({
        copied: false
      })
    }

    return [
        beginTable.join("\n"),
        columnTable.join("\n"),
        coreTable.join("\n"),
        endTable.join("\n")
      ].join("\n")
  }

  generateDangerousHTML() {
    return {__html: this.state.latexCode}
  }

  copyText() {
    return this.state.latexCode.replace(new RegExp("&#92;", 'g'), '\\');
  }

  inputRowsChanged(changedRowCount) {

    // have to call generateLatex as callback
    // because of setState asynchronity
    this.setState({
      rows: changedRowCount * 2 + 1,
      textInTable: this.initializeTextObject(changedRowCount * 2 + 1, this.state.columns),
    },  () => {
      this.setState ({ latexCode: this.generateLatexCode(changedRowCount * 2 + 1, this.state.columns)
    })});
  }

  inputColumnsChanged(changedColumnCount) {
    
    // have to call generateLatex as callback
    // because of setState asynchronity
    this.setState({
      columns: changedColumnCount * 2 + 1,
      textInTable: this.initializeTextObject(this.state.rows, changedColumnCount * 2 + 1)
    }, () => {
      this.setState ({ latexCode: this.generateLatexCode(this.state.rows, changedColumnCount * 2 + 1)
    })});
  }

  inputTextChanged( changedTextValue, row, column) {
    this.addTextToObject(row, column, changedTextValue);
    this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    });
  }

  selectBorder(row, column, direction) {
    if (direction === "row") {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder++) {
        let borderCell = this.state.refToBorders[row.toString() + columnBorder.toString()];
        if (borderCell != null && borderCell.state.direction === "row") {
          borderCell.setState({
            active: !borderCell.state.active
          }, () => {this.setState({
            latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
          })});
        }
      }
    }
    else if (direction === "column") {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder++) {
        let borderCell = this.state.refToBorders[rowBorder.toString() + column.toString()];
        if (borderCell != null && borderCell.state.direction === "column") {
          borderCell.setState({
            active: !borderCell.state.active
          }, () => {this.setState({
            latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
          })});
        }
      }
    }
  }

  hoverBorder(row, column, direction, hover) {
    if (direction === "row") {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder++) {
        let borderCell = this.state.refToBorders[row.toString() + columnBorder.toString()];
        if (borderCell != null) {
          borderCell.setState({
            hover: hover
          });
        }
      }
    }
    else if (direction === "column") {
      for (let rowBorder = 0; rowBorder < this.state.rows; rowBorder++) {
        let borderCell = this.state.refToBorders[rowBorder.toString() + column.toString()];
        if (borderCell != null) {
          borderCell.setState({
            hover: hover
          });
        }
      }
    }
  }

  render() {
    let rows = [];
    for (var row = 0; row < this.state.rows; row++){
      let cell = [];
      for (var column= 0; column < this.state.columns; column++){
        let cellId = `cell${row}-${column}`;
        let stringId = row.toString() + column.toString();
        if (row === 0) {
          if (column % 2 === 0) {
            cell.push(<BorderCell key={cellId}
              row={row} column={column} direction="column"
              onMouseEnter={this.hoverBorder.bind(this, row, column, "column", true)}
              onMouseLeave={this.hoverBorder.bind(this, row, column, "column", false)}
              onClick={this.selectBorder.bind(this, row, column, "column")}
              ref={(input) => {this.state.refToBorders[stringId] = input}} />)
          }
          else {
            cell.push(<BorderCell key={cellId}
              row={row} column={column} direction="row"
              onMouseEnter={this.hoverBorder.bind(this, row, column, "row", true)}
              onMouseLeave={this.hoverBorder.bind(this, row, column, "row", false)}
              onClick={this.selectBorder.bind(this, row, column, "row")}
              ref={(input) => {this.state.refToBorders[stringId] = input}} />)
          }
        }
        else if (row % 2 === 0) {
          if (column % 2 === 0) {
            cell.push(<BorderCell key={cellId}
              onClick={this.selectBorder.bind(this, row, column, "column", true)}
              onMouseEnter={this.hoverBorder.bind(this, row, column, "column")}
              onMouseLeave={this.hoverBorder.bind(this, row, column, "column", false)}
              row={row} column={column} direction="column"
              ref={(input) => {this.state.refToBorders[stringId] = input}} />)
          }
          else {
            cell.push(<BorderCell key={cellId}
              onClick={this.selectBorder.bind(this, row, column, "row", true)}
              onMouseEnter={this.hoverBorder.bind(this, row, column, "row", true)}
              onMouseLeave={this.hoverBorder.bind(this, row, column, "row", false)}
              row={row} column={column} direction="row"
              ref={(input) => {this.state.refToBorders[stringId] = input}} />)
          }
        }
        else {
          if (column % 2 === 0) {
            cell.push(<BorderCell key={cellId} 
              onClick={this.selectBorder.bind(this, row, column, "column")}
              onMouseEnter={this.hoverBorder.bind(this, row, column, "column", true)}
              onMouseLeave={this.hoverBorder.bind(this, row, column, "column", false)}
              ref={(input) => {this.state.refToBorders[stringId] = input}}
              row={row} column={column} direction="column" />)
          }
          else {
            cell.push(<td key={cellId}>
              <TableInputCell changedText={this.inputTextChanged} 
                row={row} column={column}/> </td>)
          }
        }      
      }
      if (row % 2 === 0){
        rows.push(<tr key={row}
           className="borderRow">{cell}</tr>)
      }
      else {
        rows.push(<tr key={row}>{cell}</tr>)
      }
    }
    return (
      <div className="container-table">
      <h1>Latex generator</h1>
        <div className="table-size-container">
          <TableRows rowValue={this.inputRowsChanged}/>
          <TableColumns columnValue={this.inputColumnsChanged}/>
        </div>
        <div className="editor-table">
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <p>
          {this.state.changedText}
        </p>
        <div
         className="code-container">
          <pre onInput={() => console.log("changed")} >
            <CopyToClipboard text={this.copyText}
              onCopy={() => this.setState({copied: true})}>
              <span  dangerouslySetInnerHTML= {this.generateDangerousHTML()}></span>
            </CopyToClipboard>
    
            <CopyToClipboard text={this.copyText}
              onCopy={() =>{this.setState({copied: true})} }>
              <button className="copy-button">Copy to clipboard with button</button>
            </CopyToClipboard>
    
            {this.state.copied ? <span style={{color: 'green'}}>Copied.</span> : null}
          </pre>
        </div>
      </div>
    );
  } 
}

class TableRows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rows: 5};

    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    this.setState({
      rows: event.target.value
    });
    this.props.rowValue(event.target.value);
  }
  render() {
    return (
      <div className="input-rows">
        Rows: <input type="number" min="1" max="20" 
          value={this.state.rows} onChange={this.onChange}/>
      </div>
    );
  }
}

class TableColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       columns: 5 
      };
    
    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    this.setState({
      columns: event.target.value
    });
    this.props.columnValue(event.target.value);
  }
  render() {
    return (
      <div className="input-columns">
        Columns: <input type="number" min="1" max="20" 
         value={this.state.columns} onChange={this.onChange}/>
      </div>
    );
  }
}

class TableInputCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      text: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      text: event.target.value
    });
    this.props.changedText(event.target.value, this.state.row, this.state.column);
  }

  render() {
    let cellId = this.state.row + "-" + this.state.column;
    return(
      <input  type="text" id={cellId} value={this.state.text} 
      onChange={this.onChange}/>
    );
  }
}

class BorderCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      direction: props.direction,
      className: '',
      active: false,
      hover: false
    };
  }

  render() {
    let cellId = this.state.row + "-" + this.state.column;
    if (this.state.direction === "row") {
      this.className = " border-row "
    }
    else if (this.state.direction === "column") {
      this.className = " border-column "
    }
    if (this.state.active) {
      this.className += " active "
    }
    if (this.state.hover) {
      this.className += " hover "
    }
    return(
      <td onMouseEnter={this.props.onMouseEnter} 
      id={cellId} className={this.className}
      onMouseLeave={this.props.onMouseLeave}
      onClick={this.props.onClick} >
      </td>
    );
  }
}
 
export default App;
