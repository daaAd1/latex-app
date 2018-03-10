import React, { Component } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import copyIcon from "./content-copy.svg";
import TextareaAutosize from 'react-autosize-textarea';
import LatexCode from "./LatexCode";

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
      refToAlignments: {},
      refToInputs: {},
      value: '',
      caption: ' ',
      label: ' ',
      abcde: ""
    };

    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.inputRowsChanged = this.inputRowsChanged.bind(this);
    this.inputColumnsChanged = this.inputColumnsChanged.bind(this);
    this.inputTextChanged = this.inputTextChanged.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateDangerousHTML = this.generateDangerousHTML.bind(this);
    this.changeCaption = this.changeCaption.bind(this);
    this.changeLabel = this.changeLabel.bind(this);
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
        let stringId = 1 + column.toString()
        let columnId = (column + 1).toString();
        let borderCell;
        if (this.state !== undefined) {
          borderCell = this.state.refToBorders[row.toString() + column.toString()];
        }
        if (column % 2 === 0  && row === 0) {
          let textAlignment;
          if (this.state !== undefined) {
            //console.log(columnId + this.state.refToAlignments[columnId])
          }
          if (this.state !==  undefined && this.state.refToAlignments[columnId] !== undefined) {
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
          //console.log(textAlignment)
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
            if (borderCell2 = this.state.refToBorders[(row + 1).toString() + 1] !== null) {
              borderCell = this.state.refToBorders[(row + 1).toString() + 1];
            }
          }
        }
        if (row === 1) {
          console.log("well this " + borderCell)
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

    if (this.state !== undefined && this.state.copied !== undefined ) {
      this.setState({
        copied: false
      })
    }

    return [
        beginTable.join("\n"),
        columnTable.join("\n"),
        coreTable.join("\n"),
        endTabular,
        captionLabelTable.join("\n"),
        endTable
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
      rows: changedRowCount * 2 + 2,
      textInTable: this.initializeTextObject(changedRowCount * 2 + 2, this.state.columns),
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
  }

  changeLabel(changedLabelText) {
    this.setState({
      label: changedLabelText
    }, () => {this.setState({
      latexCode: this.generateLatexCode(this.state.rows, this.state.columns)
    })});
  }

  render() {
    let latexCode = <LatexCode code={this.state.latexCode}></LatexCode>;
    let rows = [];
    for (var row = -1; row < this.state.rows; row++){
      let cell = [];
      for (var column= 0; column < this.state.columns; column++){
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
            if (this.state !== undefined && 
              this.state.refToAlignments[columnId] !== undefined) {
                let alignValue = this.state.refToAlignments[columnId].state.alignment
              cell.push(<td className="td" key={cellId}>
              <TableInputCell changedText={this.inputTextChanged} 
                row={row} column={column}
                alignment={alignValue}
                ref={(input) => {this.state.refToInputs[stringId] = input}} 
                /> </td>)
              }
            else {
              cell.push(<td className="td" key={cellId}>
              <TableInputCell changedText={this.inputTextChanged} 
                row={row} column={column}
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
      rows: 5
    };

    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1
      });
      this.props.rowValue(1);
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
        Rows: <input type="number" min="1" max="20" 
          value={this.state.rows} onChange={this.onChange.bind(this)}/> |
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
    if (event.target.value < 1) {
      this.setState({
        columns: 1
      });
      this.props.columnValue(1);
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
        Columns: <input type="number" min="1" max="20" 
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
      text: '',
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
      label: ''
    };

    this.onChange = this.onChange.bind(this);
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
      caption: ""
    };

    this.onChange = this.onChange.bind(this);
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
      alignment: "left",
      className: ''
    };

    this.clickLeft = this.clickLeft.bind(this)
    this.clickCenter = this.clickCenter.bind(this)
    this.clickRight = this.clickRight.bind(this)
  }
  clickLeft() {
    this.setState({
      alignment: "left"
    });
    this.props.onClick();
  }
  clickCenter() {
    this.setState({
      alignment: "center"
    });
    this.props.onClick();
  }
  clickRight() {
    this.setState({
      alignment: "right"
    });
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