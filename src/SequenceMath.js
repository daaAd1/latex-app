import React, { Component } from "react";
import LatexCode from "./LatexCode";
import TextareaAutosize from 'react-autosize-textarea';

class SequenceMath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: this.generateLinesObject(),
      linesText: this.generateLinesObject(),
      latexCode: this.generateLatexCode()
    };

    this.generateLinesObject = this.generateLinesObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateLatexCode = this.generateLatexCode.bind(this);
  }

  addLineToObject(level, levelCell, cellState) {
    var key = (level.toString()) + (levelCell.toString());
    var obj = this.state.lines;
    obj[key] = cellState;
    this.setState({
      lines: obj
    }, () => {
      this.setState ({
        latexCode: this.generateLatexCode()
    })});
  }

  addTextToObject(level, levelCell, text) {
    var key = (level.toString()) + (levelCell.toString());
    var obj = this.state.linesText;
    obj[key] = text;
    this.setState({
      linesText: obj
    }, () => {
      this.setState ({
        latexCode: this.generateLatexCode()
    })});
  }

  generateLatexCode() {
    let beginCode = [" &#92;begin{prooftree}"];
    let endCode = [" &#92;end{prooftree}"];
    let middleCode = [];
    
    for (let level = 5; level > -1; level--) {
      for (let levelCell = 1; levelCell < 33; levelCell++) {
        let row = "";
        let position = level.toString() + levelCell.toString();
        if (this.state !== undefined && this.state.linesText[position] !== ""
        && this.state.linesText[position] !== undefined) {
          if (level === 5) {
            row = "      &#92;AxiomC{" + this.state.linesText[position] + "}"
          }
          else {   
            let positionOfLine =  (level+1).toString() + (levelCell*2).toString();
            let positionOfLineTwo =  (level+1).toString() + (levelCell*2-1).toString();
            if (this.state.linesText[positionOfLine] === ""
             && this.state.linesText[positionOfLineTwo] === "") {
              row = "     &#92;AxiomC{" + this.state.linesText[position] + "}"
            }
            else {
              row = "     &#92;BinaryInfC{" + this.state.linesText[position] + "}"
            }
          }
        }
        if (row !== "") {
          console.log(row)
          middleCode.push(row);
        }
      }
    }

    return [
      beginCode,
      middleCode.join("\n"),
      endCode
    ].join("\n") 
  }

  generateLinesObject() {
    var linesObject = [];
    for (let level = 0; level < 6; level++) {
      for (let levelCell = 1; levelCell < 33; levelCell++) {
        if (level === 0 && levelCell < 2) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if (level === 1 && levelCell < 3) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 2 && levelCell < 5) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 3 && levelCell < 9) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 4 && levelCell < 17) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 5) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
      }
    }
    return linesObject;
  }

  lineClick(level, cell) {
    if (this.state.lines[level.toString() + cell.toString()] === "false"
  || this.state.lines[level.toString() + cell.toString()] === "") {
      this.addLineToObject(level, cell, "true");
    }
    else {
      this.addLineToObject(level, cell, "false");
    }
  }

  pushCell(level, cell) {
    let boolTrue = true;
    let boolFalse = false;
    let position = level.toString() + cell.toString();
    let positionOneLevelDown =  (level-1).toString() + (cell/2).toString();
    if (cell % 2 !== 0) {
      positionOneLevelDown = (level-1).toString() + ((cell + 1)/2).toString();
    }
    
    if (this.state !== null && this.state.lines[position] === "true") {
      return (<div className="cellLine">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} key={position} onClick={this.lineClick.bind(this, level, cell)}
       clicked={true}></Line></div>)
    }
    else if (this.state !== null && this.state.lines[positionOneLevelDown] === "true"){
      return  (<div className="cellLine">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} 
      onClick={this.lineClick.bind(this, level, cell)} key={position} clicked={false}></Line></div>)
    }
    else if (level === 0) {
      return  (<div className="cellLine">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} 
      onClick={this.lineClick.bind(this, level, cell)} key={position} clicked={false}></Line></div>)
    }
    else {
      return  (<div className="cellLine">
      <Line white={boolTrue} level={level} cell={cell} 
      key={position} clicked={false}></Line></div>)
    }
  }

  render() {
    let latexCode = <LatexCode code={this.state.latexCode}></LatexCode>;
    let lines = [];
    for (let level = 5; level > -1; level--) {
      let cell = [];
      for (let levelCell = 1; levelCell < 33; levelCell++) {
        let position = level.toString() + levelCell.toString();
        switch(level) {
          case 0:
            if (levelCell < 2) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 1:
            if (levelCell < 3) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 2:
            if (levelCell < 5) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 3:
          if (levelCell < 9) {
            cell.push(this.pushCell(level, levelCell));
          }
          break;
          case 4:
          if (levelCell < 17) {
            cell.push(this.pushCell(level, levelCell));
          }
          break;
          case 5:
          if (levelCell < 33) {
            cell.push(this.pushCell(level, levelCell));
          }
          break;
        }
        
        /*if (level === 0) {
          if (this.state !== null && this.state.lines[position] === "true") {
            cell.push(<div><br/><Line key={position} clicked={boolTrue}></Line></div>)
          }
          else {
            cell.push(<div><br/><Line key={position} clicked={boolFalse}></Line></div>)
            console.log("level " + position)
          }
          break;
        }*/
        
      }
      lines.push(<div className="level"><br/>{cell}</div>);
    }
    return (
      <div>
        {lines}
        {latexCode}
      </div>
    );
  }
}
   
class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: props.level,
      cell: props.cell,
      clicked: props.clicked,
      white: props.white,
      inputText: ""
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    let clickState
    if (this.state != null) {
      clickState = this.state.clicked;
    }
    else {
      clickState = false;
    }
    this.setState({
      clicked: !clickState
    });
    this.props.onClick();
  }

  onChange(event) {
    this.setState({
      inputText: event.target.value
    });
    this.props.changedText(this.state.level, this.state.cell, event.target.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.white !== this.state.white) {
      this.setState({ white: nextProps.white })
    }
  }

  render() {
    let className = " ";
    let inputClassName = " input-line ";
    if (this.state.white) {
      className += " line-div-white ";
      inputClassName += " no-input "
    }
    else {
      className += " line-div ";
   }
    if (this.state != null && this.state.clicked === true) {
      className += " line-div-clicked ";
    }
    return(
      <div className="one-line">
        <div className={className} onClick={this.onClick}/>
        <TextareaAutosize type="text" onChange={this.onChange} className={inputClassName} >
        </TextareaAutosize>
      </div>
    );
  }
}

export default SequenceMath;