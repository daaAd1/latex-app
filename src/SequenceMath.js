import React, { } from "react";
import LatexCode from "./LatexCode";
import TextareaAutosize from 'react-autosize-textarea';

class SequenceMath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: this.getInitialLinesObject(),
      linesText: this.getInitialTextObject(),
      latexCode: this.generateLatexCode(),
      annotationObject: this.getInitialAnnotationObject(),
    };

    this.lineClick = this.lineClick.bind(this);
    this.generateLinesObject = this.generateLinesObject.bind(this);
    this.addTextToObject = this.addTextToObject.bind(this);
    this.generateLatexCode = this.generateLatexCode.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
  }

  resetApplicationState() {
    window.localStorage.clear();
    window.location.reload();
  }

  getInitialLinesObject() {
    let linesObject = JSON.parse(localStorage.getItem("math-line-object")) || this.generateLinesObject();
    return linesObject;
  }

  getInitialTextObject() {
    let textObject = JSON.parse(localStorage.getItem("math-text-object")) || this.generateTextObject();
    return textObject;
  }

  getInitialAnnotationObject() {
    let annotObject = JSON.parse(localStorage.getItem("math-annotation-object")) || this.generateAnnotationObject();
    return annotObject;
  }

  componentDidMount() {
    this.setState({
      linesText: this.generateTextObject(),
      linesObject: this.generateLinesObject(),
      annotationObject: this.generateAnnotationObject(),
    }, () => {
      this.setState({
        latexCode: this.generateLatexCode()
      });
    });
  }

  generateTextObject() {
    let initialObject;
    if (this.state !== undefined && this.state.linesText !== undefined ) {
      initialObject = this.state.linesText;
    } 
    else {
      initialObject = {};
    }
    let numOfRows = 5;
    let numOfColumns = 81;
    for (let level = 0; level < numOfRows; level++) {
      for (let levelCell = 0; levelCell < numOfColumns; levelCell++) {
        let position =level.toString() + levelCell.toString();
        if (level === 0 && levelCell < 2) {
          if (this.state !== undefined && this.state.linesText !== undefined 
            && this.state.linesText[position] !== undefined) {
              initialObject[position] = this.state.linesText[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if (level === 1 && levelCell < 4) {
          if (this.state !== undefined && this.state.linesText !== undefined 
            && this.state.linesText[position] !== undefined) {
              initialObject[position] = this.state.linesText[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 2 && levelCell < 10) {
          if (this.state !== undefined && this.state.linesText !== undefined 
            && this.state.linesText[position] !== undefined) {
              initialObject[position] = this.state.linesText[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 3 && levelCell < 28) {
          if (this.state !== undefined && this.state.linesText !== undefined 
            && this.state.linesText[position] !== undefined) {
              initialObject[position] = this.state.linesText[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 4 ) {
          if (this.state !== undefined && this.state.linesText !== undefined 
            && this.state.linesText[position] !== undefined) {
              initialObject[position] = this.state.linesText[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  addLineToObject(level, levelCell, length) {
    let key = (level.toString()) + (levelCell.toString());
    let obj = this.state.lines;
    obj[key] = length;
    this.setState({
      lines: obj
    }, () => {
      this.setState ({
        latexCode: this.generateLatexCode()
    })});
    localStorage.setItem("math-line-object", JSON.stringify(obj));
  }

  addTextToObject(level, levelCell, text) {
    let key = (level.toString()) + (levelCell.toString());
    let obj = this.state.linesText;
    obj[key] = text;
    this.setState({
      linesText: obj
    }, () => {
      this.setState ({
        latexCode: this.generateLatexCode()
    })});
    localStorage.setItem("math-text-object", JSON.stringify(obj));
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
        if ((levelCell > (Math.pow(3, level) / 3) 
        && levelCell <= ((Math.pow(3, level)*2) / 3)) &&
         this.state !== undefined && 
         this.state.linesText[position] !== ""
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
    let initialObject;
    if (this.state !== undefined && this.state.linesObject!== undefined ) {
      initialObject = this.state.linesObject;
    } 
    else {
      initialObject = {};
    }
    let numOfRows = 5;
    let numOfColumns = 81;
    for (let level = 0; level < numOfRows; level++) {
      for (let levelCell = 0; levelCell < numOfColumns; levelCell++) {
        let position =level.toString() + levelCell.toString();
        if (level === 0 && levelCell < 2) {
          if (this.state !== undefined && this.state.linesObject !== undefined 
            && this.state.linesObject[position] !== undefined) {
              initialObject[position] = this.state.linesObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if (level === 1 && levelCell < 4) {
          if (this.state !== undefined && this.state.linesObject !== undefined 
            && this.state.linesObject[position] !== undefined) {
              initialObject[position] = this.state.linesObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 2 && levelCell < 10) {
          if (this.state !== undefined && this.state.linesObject !== undefined 
            && this.state.linesObject[position] !== undefined) {
              initialObject[position] = this.state.linesObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 3 && levelCell < 28) {
          if (this.state !== undefined && this.state.linesObject !== undefined 
            && this.state.linesObject[position] !== undefined) {
              initialObject[position] = this.state.linesObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 4 ) {
          if (this.state !== undefined && this.state.linesObject !== undefined 
            && this.state.linesObject[position] !== undefined) {
              initialObject[position] = this.state.linesObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  generateAnnotationObject() {
    let initialObject;
    if (this.state !== undefined && this.state.annotationObject !== undefined ) {
      initialObject = this.state.annotationObject;
    } 
    else {
      initialObject = {};
    }
    let numOfRows = 5;
    let numOfColumns = 81;
    for (let level = 0; level < numOfRows; level++) {
      for (let levelCell = 0; levelCell < numOfColumns; levelCell++) {
        let position =level.toString() + levelCell.toString();
        if (level === 0 && levelCell < 2) {
          if (this.state !== undefined && this.state.annotationObject !== undefined 
            && this.state.annotationObject[position] !== undefined) {
              initialObject[position] = this.state.annotationObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if (level === 1 && levelCell < 4) {
          if (this.state !== undefined && this.state.annotationObject !== undefined 
            && this.state.annotationObject[position] !== undefined) {
              initialObject[position] = this.state.annotationObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 2 && levelCell < 10) {
          if (this.state !== undefined && this.state.annotationObject!== undefined 
            && this.state.annotationObject[position] !== undefined) {
              initialObject[position] = this.state.annotationObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 3 && levelCell < 28) {
          if (this.state !== undefined && this.state.annotationObject !== undefined 
            && this.state.annotationObject[position] !== undefined) {
              initialObject[position] = this.state.annotationObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
        else if  (level === 4 ) {
          if (this.state !== undefined && this.state.annotationObject !== undefined 
            && this.state.annotationObject[position] !== undefined) {
              initialObject[position] = this.state.annotationObject[position];
          } 
          else {
              initialObject[position] = '';
          }
        }
      }
    }
    return initialObject;
  }

  annotationChanged(level, cell, annotText) {
    let key = (level.toString()) + (cell.toString());
    let obj = this.state.annotationObject;
    obj[key] = annotText;
    this.setState({
      annotationObject: obj
    }, () => {
      this.setState ({
        latexCode: this.generateLatexCode()
    })});
    localStorage.setItem("math-annotation-object", JSON.stringify(obj));
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

    if (this.state.linesText[positionChildrenOne] === ""
      && this.state.linesText[positionChildrenTwo] === "" 
      && this.state.linesText[positionChildrenThree] === "" 
      ) {
      readonlyAnnot = true;
    }

    let annotationText = "";
    if (this.state !== undefined && 
      this.state.annotationObject !== undefined) {
      annotationText = this.state.annotationObject[position];
    }
    if (!levelNotHighEnough && this.state !== null && this.state.lines[position] > 0) {
      return (<div key={position} className="sequence-level-cells">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell}  
      onClick={this.lineClick.bind(this,level, cell)}
      annotationChanged={this.annotationChanged}
      annotationText={annotationText}
      clicked={true} readonlyAnnot={readonlyAnnot}
       readonlyText={readonlyText}></Line></div>)
    }
    else if (!levelNotHighEnough && this.state !== null && this.state.lines[positionOneLevelDown] > 0){
      return  (<div key={position} className="sequence-level-cells">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} 
      onClick={this.lineClick.bind(this,level, cell)} 
      annotationChanged={this.annotationChanged}
      annotationText={annotationText}
      clicked={false} readonlyAnnot={readonlyAnnot}
      readonlyText={readonlyText}></Line></div>)
    }
    else if (level === 0) {
      return  (<div key={position} className="sequence-level-cells">
      <Line changedText={this.addTextToObject} white={boolFalse} level={level} cell={cell} 
      onClick={this.lineClick.bind(this,level, cell)} 
      annotationChanged={this.annotationChanged}
      annotationText={annotationText}
       clicked={false} readonlyAnnot={readonlyAnnot}
       readonlyText={readonlyText}></Line></div>)
    }
    else {
      return  (<div key={position} className="sequence-level-cells">
      <Line white={boolTrue} level={level} cell={cell} 
      annotationText={annotationText}
      clicked={false}></Line></div>)
    }
  }

  render() {
    let latexCode = <LatexCode code={this.state.latexCode}></LatexCode>;
    let lines = [];
    for (let level = 5; level > -1; level--) {
      let cell = [];
      for (let levelCell = 1; levelCell < 82; levelCell++) {
        //let position = level.toString() + levelCell.toString();
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
            default:
              break;
        }        
      }
      lines.push(<div key={level} className="sequence-level"><br/>{cell}</div>);
    }
    return (
      <div className="sequence-container">
        <button className="basic-button"
         type="text" onClick={this.resetApplicationState}>
         Reset sequence </button>
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
      length: this.getInitialLength(),
      white: props.white,
      inputText: this.getInitialText(),
      annotation: this.getInitialAnnotation(),
      annotationText: this.getInitialAnnotationText(),
      readonlyText: props.readonlyText,
      readonlyAnnot: props.readonlyAnnot
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.annotationChanged = this.annotationChanged.bind(this);
  }

  getInitialText() {
    let text = localStorage.getItem("math-line-text-" + this.props.level + this.props.cell) || "";
    return text;
  }

  getInitialLength() {
    let length = Number(localStorage.getItem("math-line-length-" + this.props.level + this.props.cell)) || 0;
    return length;
  }

  getInitialAnnotation() {
    let annotation = localStorage.getItem("math-line-annotation-" + this.props.level + this.props.cell) || false;
    return annotation;
  }

  getInitialAnnotationText() {
    let annotationText = localStorage.getItem("math-line-annotation-text-" + this.props.level + this.props.cell) || this.props.annotationText;
    return annotationText;
  }

  onClick(event) {
    if (this.state !== null && this.state.length === 3) {
      this.setState({
        annotation: false,
        length: 0
      }, () => {
        localStorage.setItem("math-line-length-" + this.state.level + this.state.cell, 0);
        localStorage.setItem("math-line-annotation-" + this.state.level + this.state.cell, false);
        this.props.onClick(this.state.length);
      });
    }
    else {
      this.setState({
        annotation: true,
        length: this.state.length + 1
      }, () => {
        localStorage.setItem("math-line-length-" + this.state.level + this.state.cell, this.state.length);
        localStorage.setItem("math-line-annotation-" + this.state.level + this.state.cell, true);
        this.props.onClick(this.state.length);
      });
    }
  }

  onChange(event) {
    this.setState({
      inputText: event.target.value
    });
    localStorage.setItem("math-line-text-"+ this.props.level + this.props.cell, event.target.value);
    this.props.changedText(this.state.level, this.state.cell, event.target.value);
  }

  annotationChanged(event) {
    this.setState({
      annotationText: event.target.value
    })
    localStorage.setItem("math-line-annotation-text-" + this.state.level + this.state.cell, event.target.value);
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
    let inputClassName = " sequence-cell-text ";
    if (this.state.white) {
      className += " sequence-cell-length-white ";
      inputClassName += " sequence-cell-text-no-input "
    }
    else {
      if (this.state.length === 0) {
        className += " sequence-cell-length-0 ";
      } 
      else if (this.state.length === 1) {
        className += " sequence-cell-length-1 ";
      }
      else if (this.state.length === 2) {
        className += " sequence-cell-length-2 ";
      }
      else if (this.state.length === 3) {
        className += " sequence-cell-length-3 ";
      }
   }
    return(
      <div className="sequence-line">
        <div className="sequence-line-annotation">
          <div className={className} onClick={this.onClick.bind(this)}>
          </div>
          { this.state.annotation && 
            <TextareaAutosize readOnly={this.state.readonlyAnnot} 
            type="text" className="sequence-annotation-text"
            onChange={this.annotationChanged}
            value={this.state.annotationText}/>  }
        </div>
        <TextareaAutosize readOnly={this.state.readonlyText} 
        value={this.state.inputText} className={inputClassName}
         type="text" onChange={this.onChange} />
      </div>
    );
  }
}

export default SequenceMath;