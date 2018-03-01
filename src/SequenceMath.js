import React, { Component } from "react";

class SequenceMath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latexCode: '',
      lines: this.generateLinesObject()
    };

    this.generateLinesObject = this.generateLinesObject.bind(this);
    //this.lineClick = this.lineClick.bin
  }

  addLineToObject(level, levelCell, cellState) {
    var key = (level.toString()) + (levelCell.toString());
    var obj = this.state.lines;
    obj[key] = cellState;
    this.setState({
      linesObject: obj
    });
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
      console.log("else " + this.state.lines[level.toString() + cell.toString()])
      this.addLineToObject(level, cell, "false");
    }
  }

  pushCell(level, cell) {
    let position = level.toString() + cell.toString();
    let positionOneLevelDown =  (level-1).toString() + (cell/2).toString();
    if (cell % 2 !== 0) {
      positionOneLevelDown = (level-1).toString() + ((cell + 1)/2).toString();
      console.log(positionOneLevelDown + " " + level + " " + cell)
      console.log(cell)  
    }
    
    if (this.state !== null && this.state.lines[position] === "true") {
      return (<div className="cellLine">
      <Line level={level} cell={cell} key={position} onClick={this.lineClick.bind(this, level, cell)}
       clicked={true}></Line></div>)
    }
    else if (this.state !== null && this.state.lines[positionOneLevelDown] === "true"){
      return  (<div className="cellLine">
      <Line level={level} cell={cell} 
      onClick={this.lineClick.bind(this, level, cell)} key={position} clicked={false}></Line></div>)
    }
    else if (level === 0) {
      return  (<div className="cellLine">
      <Line level={level} cell={cell} 
      onClick={this.lineClick.bind(this, level, cell)} key={position} clicked={false}></Line></div>)
    }
  }

  render() {
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
        <p>abc</p>
        {lines}
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
      clicked: props.clicked
    };
    this.onClick = this.onClick.bind(this);
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

  render() {
    let className;
    if (this.state != null && this.state.clicked === true) {
      className = " line-div line-div-clicked ";
    }
    else {
      className = " line-div "
    }
    return(
      <div className={className} onClick={this.onClick}/>
    );
  }
}

export default SequenceMath;