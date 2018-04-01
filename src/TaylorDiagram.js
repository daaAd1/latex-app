import React, { } from "react";
import LatexCode from "./LatexCode";
import Arrow from "./Arrow";

class TaylorDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 2,
    }
  };

  onRowsChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1
      });
    }
    else if (event.target.value > 20) {
      this.setState({
        rows: 20
      });
    }
    else {
      this.setState({
        rows: event.target.value
      });
    }
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
    for (let numOfRows = 0; numOfRows < this.state.rows; 
      numOfRows++ ) {
        rows.push(<Row key={numOfRows}> </Row>);
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
      columns: 3,
    }
  };

  onColumnsChange(event) {
    if (event.target.value < 1) {
      this.setState({
        columns: 1
      });
    }
    else if (event.target.value > 20) {
      this.setState({
        columns: 20
      });
    }
    else {
      this.setState({
        columns: event.target.value
      });
    }
  }

  render() {
    let cells = [];
    
    for (let numOfCells  = 0; numOfCells < 
      this.state.columns; numOfCells++) {
        cells.push(
        <div key={numOfCells} className="cellArrows">
          <div className="arrowButtons">
            <Arrow arrowType="lu" /><Arrow arrowType="u" />
            <Arrow arrowType="ru" /><Arrow arrowType="l" />
            <Arrow arrowType="r" /><Arrow arrowType="ld" />
            <Arrow arrowType="d" /><Arrow arrowType="r" />
          </div>
          <input type="text" />
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
   
  export default TaylorDiagram;