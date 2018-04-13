import React, { } from "react";
//import copyIcon from "./content-copy.svg";
import TextareaAutosize from 'react-autosize-textarea';
import LatexCode from "./LatexCode";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.getInitialRowsState(), 
      columns: this.getInitialColumnsState(),
      textInTable: this.getInitialTextObject(),
      latexCode: "",
      caption: this.getInitialCaption(),
      label: this.getInitialLabel(),
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

  resetApplicationState() {
    window.localStorage.clear();
    window.location.reload();
  }

  getInitialRowsState() {
    let localRows = localStorage.getItem("table-rows") || 11;
    return localRows;
  }

  getInitialColumnsState() {
    let columns = localStorage.getItem("table-columns") || 11;
    return columns;
  }

  getInitialTextObject() {
    let textObject = JSON.parse(localStorage.getItem("table-textObject")) || this.initializeTextObject();
    return textObject;
  }

  getInitialCaption() {
    let caption = localStorage.getItem("table-caption") || "";
    return caption;
  }

  getInitialLabel() {
    let label = localStorage.getItem("table-label") || "";
    return label;
  }

  componentDidMount() {
    this.setState({
      textInTable: this.initializeTextObject(),
    }, () => {
      this.setState({
        latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
      });
    });
  }

  initializeTextObject() {
    let initialObject;
    if (this.state !== undefined && this.state.textInTable !== undefined ) {
      initialObject = this.state.textInTable;
    } 
    else {
      initialObject = {};
    }
    let numOfRows = 11;
    if (this.state !== undefined && this.state.rows !== undefined) {
      numOfRows = this.state.rows;
    }
    let numOfColumns = 11;
    if (this.state !== undefined && this.state.columns !== undefined) {
      numOfColumns = this.state.columns;
    }
    for (let row = 0; row < numOfRows; row++) {
      for (let column = 0; column < numOfColumns; column++) {
        let position = row.toString() + column.toString();
        if (this.state !== undefined && this.state.textInTable !== undefined 
          && this.state.textInTable[position] !== undefined) {
            initialObject[position] = this.state.textInTable[position];
          } 
          else {
              initialObject[position] = '';
          }
      }
    }
    return initialObject;
  }

  addTextToObject(row, column, text) {
    let key = (row.toString()) + (column.toString());
    let obj = this.state.textInTable;
    obj[key] = text;
    this.setState({
      textInTable: obj
    });
    localStorage.setItem("table-textObject", JSON.stringify(obj));
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
        let columnId = (column + 1).toString();
        let borderCell;
        if (this.state !== undefined) {
          borderCell = this.state.refToBorders[row.toString() + column.toString()];
        }
        if (column % 2 === 0  && row === 0) {
          let textAlignment;
          if (this.state !==  undefined && this.state.refToAlignments[columnId] !== undefined
          && this.state.refToAlignments[columnId] !== null) {
            let alignment = this.state.refToAlignments[columnId].state.alignment;
            if (alignment === "center") { 
              textAlignment = "c"
            }
            else if (alignment === "right") {
              textAlignment = "r"
            }
            else {
              textAlignment = "l"
            }
          }
          else {
            textAlignment = "l"
          }
          if (borderCell !== undefined) {
            if (borderCell.state.active === true) {
              if (column === columns -1 ) {
                columnBorderText += "|"
              }
              else {
                columnBorderText += "|" + textAlignment
              }
            }
            else if (column !== columns - 1) {
              columnBorderText += textAlignment
            }
          }
          else if (column !== columns - 1) {
            columnBorderText += textAlignment
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
        if (this.state !== undefined)  {
          if (row === 1) {
            if (this.state.refToBorders[(row - 1).toString() + 1] !== null) {
              borderCell = this.state.refToBorders[(row - 1).toString() + 1];
            }
            if (this.state.refToBorders[(row + 1).toString() + 1] !== null) {
              borderCell2 = this.state.refToBorders[(row + 1).toString() + 1];
            }
          }
          else {
            if (this.state.refToBorders[(row + 1).toString() + 1] !== null) {
              borderCell = this.state.refToBorders[(row + 1).toString() + 1];
            }
          }
        }
        if (row === 1) {
          if (borderCell !== undefined && borderCell.state !== undefined && borderCell.state.active === true) {
            if (borderCell2 !== undefined && borderCell2.state.active === true) {
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
            if (borderCell2 !== undefined && borderCell2.state.active === true) {
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
  
    let endTabular = [
      "   &#92;end{tabular} "
    ];

    let captionLabelTable = [];
    if (this.state !== undefined) {
      captionLabelTable.push("   &#92;caption{" + this.state.caption + "}");
      captionLabelTable.push("   &#92;label{" + this.state.label + "}");
    }
    else {
      captionLabelTable.push("   &#92;caption{ }")
      captionLabelTable.push("   &#92;label{ }");
    }
    let endTable = [
        " &#92;end{table} "
    ];

    let finalString = [
      beginTable.join("\n"),
      columnTable.join("\n"),
      coreTable.join("\n"),
      endTabular,
      captionLabelTable.join("\n"),
      endTable
    ].join("\n");

    return finalString;
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
    localStorage.setItem("table-rows", changedRowCount * 2 + 1);
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
    localStorage.setItem("table-columns", changedColumnCount * 2 + 1);
  }

  inputTextChanged( changedTextValue, row, column) {
    this.addTextToObject(row, column, changedTextValue);
    this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    });
  }

  selectBorder(row, column, direction) {
    let borderCell = this.state.refToBorders[row.toString() + column.toString()];
    let newBorderActiveValue = false;
    if (borderCell != null) {
      newBorderActiveValue = !borderCell.state.active;
    }
    if (direction === "row") {
      for (let columnBorder = 0; columnBorder < this.state.columns; columnBorder++) {
        let borderCell = this.state.refToBorders[row.toString() + columnBorder.toString()];
        if (borderCell != null && borderCell.state.direction === "row") {
          localStorage.setItem("table-border-" + row + columnBorder, newBorderActiveValue);            
          borderCell.setState({
            active: newBorderActiveValue
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
          localStorage.setItem("table-border-" + rowBorder + column, newBorderActiveValue);
          borderCell.setState({
            active: newBorderActiveValue
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

  alignCell(column) {
    let columnId = column.toString();
    for (let row = 0; row < this.state.rows; row++) {
      if (this.state !== undefined && row % 2 !== 0 &&
         this.state.refToAlignments[columnId] !== undefined 
        && this.state.refToInputs[row + columnId] !== undefined ) {
          let alignment = this.state.refToAlignments[columnId].state.alignment;
          let inputCell = this.state.refToInputs[row + columnId];
          inputCell.setState({
            alignment: alignment
          }, () => {this.setState({
            latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
          })});
      }
    }
  }

  changeCaption(changedCaptionText) {
    this.setState({
      caption: changedCaptionText
    }, () => {this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    })});
    localStorage.setItem("table-caption", changedCaptionText);
  }

  changeLabel(changedLabelText) {
    this.setState({
      label: changedLabelText
    }, () => {this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    })});
    localStorage.setItem("table-label", changedLabelText);
  }

  render() {
    let latexCode = <LatexCode code={this.state.latexCode}></LatexCode>;
    let rows = [];
    for (let row = -1; row < this.state.rows; row++){
      let cell = [];
      for (let column= 0; column < this.state.columns; column++){
        let cellId = `cell${row}-${column}`;
        let stringId = row.toString() + column.toString();
        let columnId = column.toString();
        if (row === -1) {
          if (column % 2 !== 0) {
            cell.push(<AlignmentCell key={cellId}
            row={row} column={column}
            onClick={this.alignCell.bind(this, column)}
            ref={(input) => {this.state.refToAlignments[columnId] = input}}>
            </AlignmentCell>)
          }
          
        }
        else if (row === 0) {
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
            let inputText = "";
            if (this.state !== undefined && 
              this.state.refToAlignments[columnId] !== undefined
              && this.state.refToAlignments[columnId] !== null) {
              if (this.state !== undefined && 
                this.state.textInTable !== undefined) {
                inputText = this.state.textInTable[stringId];
              }
              let alignValue = this.state.refToAlignments[columnId].state.alignment
              cell.push(<td className="td" key={cellId}>
              <TableInputCell changedText={this.inputTextChanged} 
                row={row} column={column}
                alignment={alignValue} text={inputText}
                ref={(input) => {this.state.refToInputs[stringId] = input}} 
                /> </td>)
              }
            else {
              if (this.state !== undefined && 
              this.state.textInTable !== undefined) {
                inputText = this.state.textInTable[stringId];
              }
              cell.push(<td className="td" key={cellId}>
              <TableInputCell changedText={this.inputTextChanged} 
                row={row} column={column} text={inputText}
                alignment={"left"}
                ref={(input) => {this.state.refToInputs[stringId] = input}} 
                /> </td>)
            }
          }            
        }      
      }
      if (row % 2 === 0){
        rows.push(<tr key={row}
           className="borderRow">{cell}</tr>)
      }
      else {
        rows.push(<tr className="tr" key={row}>{cell}</tr>)
      }
    }
    return (
      <div className="container-table">
        <TableCaption changeCaption={this.changeCaption}> </TableCaption>
        <TableLabel changeLabel={this.changeLabel}> </TableLabel>
        <button type="text" onClick={this.resetApplicationState}>Reset table</button>
        <div className="table-size-container">
          <TableRows rowValue={this.inputRowsChanged.bind(this)}/>
          <TableColumns columnValue={this.inputColumnsChanged.bind(this)}/>
        </div>
        <div className="editor-table">
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        {latexCode}
      </div>
    );
  } 
}

class TableRows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: this.getInitialRowsState(),
    };

    this.onChange = this.onChange.bind(this);
  }

  getInitialRowsState() {
    let rows = 5;
    if (localStorage.getItem("table-rows") !== null) {
      rows = (localStorage.getItem("table-rows")-1)/2;
    }
    return rows;
  }

  onChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1
      });
      this.props.rowValue(1);
    }
    else if (event.target.value > 25) {
      this.setState({
        rows: 25
      });
      this.props.rowValue(25);
    }
    else {
      this.setState({
        rows: event.target.value
      });
      this.props.rowValue(event.target.value);
    }
  }
  render() {
    return (
      <div className="input-rows">
        Rows: <input type="number" min="1" max="25" 
          value={this.state.rows} onChange={this.onChange.bind(this)}/> |
      </div>
    );
  }
}

class TableColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getInitialColumnsState(), 
    };
    
    this.onChange = this.onChange.bind(this);
  }

  getInitialColumnsState() {
    let columns = 5;
    if (localStorage.getItem("table-columns") !== null) {
      columns = (localStorage.getItem("table-column")-1)/2;
    }
    return columns;
  }

  onChange(event) {
    if (event.target.value < 1) {
      this.setState({
        columns: 1
      });
      this.props.columnValue(1);
    }
    else if (event.target.value > 15) {
      this.setState({
        columns: 15
      });
      this.props.columnValue(15);
    }
    else {
      this.setState({
        columns: event.target.value
      });
      this.props.columnValue(event.target.value);
    }
    
    
  }
  render() {
    return (
      <div className="input-columns">
        Columns: <input type="number" min="1" max="15" 
         value={this.state.columns} onChange={this.onChange.bind(this)}/>
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
      text: props.text,
      alignment: props.alignment
    };

    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.alignment !== this.state.alignment) {
      this.setState({ alignment: nextProps.alignment });
    }
  }
  onChange(event) {
    this.setState({
      text: event.target.value
    });
    this.props.changedText(event.target.value, this.state.row, this.state.column);
  }

  render() {
    let className;
    if (this.state.alignment === "left") {
      className = "left-aligned";
    }
    else if (this.state.alignment === "center") {
      className = "center-aligned"
    }
    else if (this.state.alignment === "right") {
      className = "right-aligned";
    }
    let cellId = this.state.row + "-" + this.state.column;
    return(
      <TextareaAutosize className={className}  type="text" id={cellId} value={this.state.text} 
      onChange={this.onChange}></TextareaAutosize>
    );
  }
}

class TableLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.getInitialLabel(),
    };

    this.onChange = this.onChange.bind(this);
  }

  getInitialLabel() {
    let label = localStorage.getItem("table-label") || "";
    return label;
  }

  onChange(event) {
    this.setState({
      label: event.target.value
    });
    this.props.changeLabel(event.target.value);
  }

  render() {
    return(
      <div className="label-container">
        <label htmlFor="label"> Label: </label>
        <input value={this.state.label} 
         type="text" id="label" onChange={this.onChange}/>
      </div>
    );
  }
}

class TableCaption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: this.getInitialCaption(),
    };

    this.onChange = this.onChange.bind(this);
  }

  getInitialCaption() {
    let caption = localStorage.getItem("table-caption") || "";
    return caption;
  }

  onChange(event) {
    this.setState({
      caption: event.target.value
    });
    this.props.changeCaption(event.target.value);
  }

  render() {
    return(
      <div className="caption-container">
        <label htmlFor="caption"> Caption: </label>
        <input value={this.state.caption} 
        type="text" id="caption" onChange={this.onChange} />
      </div>
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
      active: this.getInitialBorderState(),
      hover: false,
    };
  }

  getInitialBorderState() {
    let border = localStorage.getItem("table-border-" +
     this.props.row + this.props.column) || false;
     return border;
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
      this.className += " active-border "
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

class AlignmentCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      alignment: this.getInitialAlignment(),
      className: '',
    };

    this.clickLeft = this.clickLeft.bind(this)
    this.clickCenter = this.clickCenter.bind(this)
    this.clickRight = this.clickRight.bind(this)
  }

  getInitialAlignment() {
    let alignment = localStorage.getItem("table-alignment-" + 
this.props.column) || "left";
    return alignment;
  }

  clickLeft() {
    this.setState({
      alignment: "left"
    });
    localStorage.setItem("table-alignment-" + this.state.column, "left");
    this.props.onClick();
  }
  clickCenter() {
    this.setState({
      alignment: "center"
    });
    localStorage.setItem("table-alignment-" + this.state.column, "center");
    this.props.onClick();
  }
  clickRight() {
    this.setState({
      alignment: "right"
    });
    localStorage.setItem("table-alignment-" + this.state.column, "right");
    this.props.onClick();
  }
  render() {
    let leftClassName = "";
    let centerClassName = "";
    let rightClassName = "";
    if (this.state.alignment === "left") {
      leftClassName = "left-aligned";
    }
    else if (this.state.alignment === "center")  {
      centerClassName = "center-aligned";
    }
    else if (this.state.alignment === "right") {
      rightClassName = "right-aligned";
    }
    return (
      <td className="alignment-part">
        <button className={leftClassName} onClick={this.clickLeft}>l</button>
        <button className={centerClassName} onClick={this.clickCenter}>c</button>
        <button className={rightClassName} onClick={this.clickRight}>r</button>
      </td>
    );
  }
}

export default Table;