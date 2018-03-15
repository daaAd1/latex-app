import React, { Component } from "react";
import LatexCode from "./LatexCode";
import TextareaAutosize from 'react-autosize-textarea';

class SequenceMath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: this.generateLinesObject(),
      linesText: this.generateLinesObject(),
      latexCode: this.generateLatexCode(),
      annotationObject: this.generateLinesObject()
    };

    this.lineClick = this.lineClick.bind(this);
    this.generateLinesObject = this.generateLinesObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
  }

  addLineToObject(level, levelCell, length) {
    var key = (level.toString()) + (levelCell.toString());
    var obj = this.state.lines;
    obj[key] = length;
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
    
    for (let level = 4; level > 0; level--) {
      for (let levelCell = 1; levelCell < 28; levelCell++) {
        let row = "";
        let position = level.toString() + levelCell.toString();
        if (levelCell <= (Math.pow(3, level) / 3) && this.state !== undefined && this.state.linesText[position] !== ""
        && this.state.linesText[position] !== undefined) {
          if (level === 4) {
            row = "      &#92;AxiomC{" + this.state.linesText[position] + "}"
          }
          else {   
            let positionOfText =  (level+1).toString() + (levelCell*3).toString();
            let positionOfTextTwo =  (level+1).toString() + (levelCell*3-1).toString();
            let positionOfTextThree = (level + 1).toString() + (levelCell*3-2).toString();
            if (this.state.linesText[positionOfText] === ""
             && this.state.linesText[positionOfTextTwo] === ""
            && this.state.linesText[positionOfTextThree] === "") {
              row = "     &#92;AxiomC{" + this.state.linesText[position] + "}"
            }
            else {
              if (this.state.annotationObject[position] !== "") {
                row = "     &#92;RightLabel{&#92;scriptsize(" + 
                this.state.annotationObject[position] +")}";
                middleCode.push(row);   
              }
              let numberOfNodes = 0;
              if (this.state.linesText[positionOfText] !== "") {
                  numberOfNodes++;
              }
              if (this.state.linesText[positionOfTextTwo] !== "") {
                numberOfNodes++;
              }
              if (this.state.linesText[positionOfTextThree] !== "") {
                numberOfNodes++;
              }
              if (numberOfNodes === 1) {
                row = "     &#92;UnaryInfC{" + this.state.linesText[position] + "}"
              }
              else if (numberOfNodes === 2) {
                row = "     &#92;BinaryInfC{" + this.state.linesText[position] + "}"
              }
              else if (numberOfNodes === 3) {
                row = "     &#92;TrinaryInfC{" + this.state.linesText[position] + "}"
              }
            }
          }
        }
        if (row !== "") {
          middleCode.push(row);
        }
      }
    }

    for (let level = 4; level > 0; level--) {
      for (let levelCell = 1; levelCell < 55; levelCell++) {
        let row = "";
        let position = level.toString() + levelCell.toString();
        // console.log(((Math.pow(3, level-1)) / 3).toString() + " " + (((Math.pow(3, level-1)*2) / 3)).toString())
        if ((levelCell > (Math.pow(3, level) / 3) && levelCell <= ((Math.pow(3, level)*2) / 3)) && this.state !== undefined && this.state.linesText[position] !== ""
        && this.state.linesText[position] !== undefined) {
          if (level === 4) {
            row = "      &#92;AxiomC{" + this.state.linesText[position] + "}"
          }
          else {
            let positionOfText =  (level+1).toString() + (levelCell*3).toString();
            let positionOfTextTwo =  (level+1).toString() + (levelCell*3-1).toString();
            let positionOfTextThree = (level + 1).toString() + (levelCell*3-2).toString();
            if (this.state.linesText[positionOfText] === ""
             && this.state.linesText[positionOfTextTwo] === ""
            && this.state.linesText[positionOfTextThree] === "") {
              row = "     &#92;AxiomC{" + this.state.linesText[position] + "}"
            }
            else {
              if (this.state.annotationObject[position] !== "") {
                row = "     &#92;RightLabel{&#92;scriptsize(" + 
                this.state.annotationObject[position] +")}";
                middleCode.push(row);   
              }
              let numberOfNodes = 0;
              if (this.state.linesText[positionOfText] !== "") {
                  numberOfNodes++;
              }
              if (this.state.linesText[positionOfTextTwo] !== "") {
                numberOfNodes++;
              }
              if (this.state.linesText[positionOfTextThree] !== "") {
                numberOfNodes++;
              }
              if (numberOfNodes === 1) {
                row = "     &#92;UnaryInfC{" + this.state.linesText[position] + "}"
              }
              else if (numberOfNodes === 2) {
                row = "     &#92;BinaryInfC{" + this.state.linesText[position] + "}"
              }
              else if (numberOfNodes === 3) {
                row = "     &#92;TrinaryInfC{" + this.state.linesText[position] + "}"
              }
            }
          }
        }
        if (row !== "") {
          middleCode.push(row);
        }
      }
    }
    for (let level = 4; level > -1; level--) {
      for (let levelCell = 0; levelCell < 82; levelCell++) {
        let row = "";
        let position = level.toString() + levelCell.toString();
        if (levelCell > ((Math.pow(3, level)*2) / 3) && this.state !== undefined && this.state.linesText[position] !== ""
        && this.state.linesText[position] !== undefined) {
          if (level === 4) {
            row = "      &#92;AxiomC{" + this.state.linesText[position] + "}"
          }
          else {   
            let positionOfText =  (level+1).toString() + (levelCell*3).toString();
            let positionOfTextTwo =  (level+1).toString() + (levelCell*3-1).toString();
            let positionOfTextThree = (level + 1).toString() + (levelCell*3-2).toString();
            if (this.state.linesText[positionOfText] === ""
             && this.state.linesText[positionOfTextTwo] === ""
            &&  this.state.linesText[positionOfTextThree] === "") {
              row = "     &#92;AxiomC{" + this.state.linesText[position] + "}"
            }
            else {
              if (this.state.annotationObject[position] !== "") {
                row = "     &#92;RightLabel{&#92;scriptsize(" + 
                this.state.annotationObject[position] +")}";
                middleCode.push(row);   
              }
              let numberOfNodes = 0;
              if (this.state.linesText[positionOfText] !== "") {
                  numberOfNodes++;
              }
              if (this.state.linesText[positionOfTextTwo] !== "") {
                numberOfNodes++;
              }
              if (this.state.linesText[positionOfTextThree] !== "") {
                numberOfNodes++;
              }
              if (numberOfNodes === 1) {
                row = "     &#92;UnaryInfC{" + this.state.linesText[position] + "}"
              }
              else if (numberOfNodes === 2) {
                row = "     &#92;BinaryInfC{" + this.state.linesText[position] + "}"
              }
              else if (numberOfNodes === 3) {
                row = "     &#92;TrinaryInfC{" + this.state.linesText[position] + "}"
              }
            }
          }
        }
        if (row !== "") {
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
    for (let level = 0; level < 5; level++) {
      for (let levelCell = 1; levelCell < 81; levelCell++) {
        if (level === 0 && levelCell < 2) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if (level === 1 && levelCell < 4) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 2 && levelCell < 10) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 3 && levelCell < 28) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
        else if  (level === 4 ) {
          var key = (level.toString()) + (levelCell.toString());
          linesObject[key] = '';
        }
      }
    }
    return linesObject;
  }

  annotationChanged(level, cell, annotText) {
    var key = (level.toString()) + (cell.toString());
    var obj = this.state.annotationObject;
    obj[key] = annotText;
    this.setState({
      annotationObject: obj
    }, () => {
      this.setState ({
        latexCode: this.generateLatexCode()
    })});
  }

  lineClick(level, cell, length) {
    if (this.state.lines[level.toString() + cell.toString()] === "false"
  || this.state.lines[level.toString() + cell.toString()] === "") {
      this.addLineToObject(level, cell, length);
    }
    else {
      this.addLineToObject(level, cell, length);
    }
  }

  pushCell(level, cell) {
    let boolTrue = true;
    let boolFalse = false;
    let position = level.toString() + cell.toString();
    let positionOneLevelDown =  (level-1).toString() + (cell/2).toString();
    let levelNotHighEnough = false;
    if ((cell + 2) % 3 === 0) {
      positionOneLevelDown = (level-1).toString() + ((cell + 2)/3).toString();
      if (this.state.lines[positionOneLevelDown] < 1) {
        levelNotHighEnough = true;
      }
    }
    else if ((cell + 1) % 3 === 0) {
      positionOneLevelDown = (level-1).toString() + ((cell + 1)/3).toString();
      if (this.state.lines[positionOneLevelDown] < 2) {
        levelNotHighEnough = true;
      }
    }
    else if (cell % 3 === 0) {
        positionOneLevelDown = (level-1).toString() + (cell/3).toString();
        if (this.state.lines[positionOneLevelDown] < 3) {
          levelNotHighEnough = true;
        }
    }
    let readonlyAnnot = false;
    let readonlyText = true;
    if (this.state.linesText[positionOneLevelDown] !== "") {
      readonlyText = false;
    }
    let positionChildrenOne = (level + 1).toString() + (cell*3).toString();
    let positionChildrenTwo = (level + 1).toString() + (cell*3-1).toString();
    let positionChildrenThree = (level + 1).toString() + (cell*3-2).toString();
    if (position === "01") {
      console.log(this.state.linesText[positionChildrenOne])
      console.log(this.state.linesText[positionChildrenTwo])
      console.log(this.state.linesText[positionChildrenThree])
    }
    if (this.state.linesText[positionChildrenOne] === ""
  && 
   this.state.linesText[positionChildrenTwo] === "" &&

  this.state.linesText[positionChildrenThree] === "" 
) {
      readonlyAnnot = true;
    }

    if (!levelNotHighEnough && this.state !== null && this.state.lines[position] > 0) {
      return (<div className="cellLine">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} key={position} 
      onClick={this.lineClick.bind(this,level, cell)} 
      annotationChanged={this.annotationChanged}
      clicked={true} readonlyAnnot={readonlyAnnot}
       readonlyText={readonlyText}></Line></div>)
    }
    else if (!levelNotHighEnough && this.state !== null && this.state.lines[positionOneLevelDown] > 0){
      return  (<div className="cellLine">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} 
      onClick={this.lineClick.bind(this,level, cell)} 
      annotationChanged={this.annotationChanged}
      key={position} clicked={false} readonlyAnnot={readonlyAnnot}
      readonlyText={readonlyText}></Line></div>)
    }
    else if (level === 0) {
      return  (<div className="cellLine">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} 
      onClick={this.lineClick.bind(this,level, cell)} 
      annotationChanged={this.annotationChanged}
       key={position} clicked={false} readonlyAnnot={readonlyAnnot}
       readonlyText={readonlyText}></Line></div>)
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
      for (let levelCell = 1; levelCell < 82; levelCell++) {
        let position = level.toString() + levelCell.toString();
        switch(level) {
          case 0:
            if (levelCell < 2) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 1:
            if (levelCell < 4) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 2:
            if (levelCell < 10) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 3:
            if (levelCell < 28) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
          case 4:
            if (levelCell < 82) {
              cell.push(this.pushCell(level, levelCell));
            }
            break;
        }        
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
      length: 0,
      white: props.white,
      inputText: "",
      annotation: false,
      annotationText: "",
      readonlyText: props.readonlyText,
      readonlyAnnot: props.readonlyAnnot
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
  }

  onClick() {
    let length;
    if (this.state !== null && this.state.length === 3) {
      length = 0;
      this.setState({
        annotation: false
      })
    }
    else {
      length = this.state.length + 1;
      this.setState({
        annotation: true
      })
    }
    this.setState({
      length: length
    });
    this.props.onClick(length);
  }

  onChange(event) {
    this.setState({
      inputText: event.target.value
    });
    this.props.changedText(this.state.level, this.state.cell, event.target.value);
  }

  annotationChanged(event) {
    this.setState({
      annotationText: event.target.value
    })

    this.props.annotationChanged(this.state.level, this.state.cell, event.target.value)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.white !== this.state.white) {
      this.setState({ white: nextProps.white })
    }
    if (nextProps.readonlyAnnot !== this.state.readonlyAnnot) {
      this.setState({
        readonlyAnnot: nextProps.readonlyAnnot
      })
    }
    if (nextProps.readonlyText !== this.state.readonlyText) {
      this.setState({
        readonlyText: nextProps.readonlyText
      })
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
      if (this.state.length === 0) {
        className += " filled-div0 ";
      } 
      else if (this.state.length === 1) {
        className += " filled-div1 ";
      }
      else if (this.state.length === 2) {
        className += " filled-div2 ";
      }
      else if (this.state.length === 3) {
        className += " filled-div3 ";
      }
   }
    if (this.state != null && this.state.clicked === true) {
      className += " line-div-clicked ";
    }
    if (this.state.annotation) {

    }
    return(
      <div className="one-line">
        <div className="lineAnnotation">
          <div className={className} onClick={this.onClick}/>
          {this.state.annotation && 
            <TextareaAutosize readOnly={this.state.readonlyAnnot} type="text" className="annotationText"
            onChange={this.annotationChanged}> 
            </TextareaAutosize> 
          }
        </div>
        <TextareaAutosize readOnly={this.state.readonlyText}
         type="text" onChange={this.onChange} className={inputClassName} >
        </TextareaAutosize>
      </div>
    );
  }
}

export default SequenceMath;