import React from 'react';
import TaylorCell from './TaylorCell';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TaylorRow
*/

/*
Komponent, ktorý má na starosti zobrazenie riadkov so vstupnými poliami v Taylorovych diagramoch.
*/

/*
Komponent dostáva od rodiča číslo riadku. Rodičovi posiela pri zmene počtu stĺpcov nový počet stĺpcov.
Taktiež mu posiela dáta pri zmene textu vo vstupnom poli, alebo pri zmene vlastností šípky.
*/

/*  global localStorage: false, console: false, */

class TaylorRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      columns: this.getInitialColumns(),
      rowText: this.getInitialRowText(),
      arrowObject: JSON.parse(props.arrowObject),
    };

    this.onColumnsChange = this.onColumnsChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      rowText: this.getInitialRowText(),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rowText !== JSON.stringify(this.state.rowText)) {
      this.setState({
        rowText: JSON.parse(nextProps.rowText),
      });
    }
    if (nextProps.arrowObject !== JSON.stringify(this.state.arrowObject)) {
      this.setState({
        arrowObject: JSON.parse(nextProps.arrowObject),
      });
    }
  }

  onColumnsChange(event) {
    if (event.target.value < 1) {
      this.setState({
        columns: 1,
      });
      this.props.onColumnsChange(1);
      localStorage.setItem(`taylor-row-columns-${this.props.row}`, 1);
    } else if (event.target.value > 10) {
      this.setState({
        columns: 10,
      });
      this.props.onColumnsChange(10);
      localStorage.setItem(`taylor-row-columns-${this.props.row}`, 10);
    } else {
      this.setState({
        columns: event.target.value,
      });
      this.props.onColumnsChange(event.target.value);
      localStorage.setItem(`taylor-row-columns-${this.props.row}`, event.target.value);
    }
  }

  getInitialRowText() {
    const rowText =
      localStorage.getItem(`taylor-row-text-${this.props.row}`) || JSON.parse(this.props.rowText);
    return rowText;
  }

  getInitialColumns() {
    const columns = localStorage.getItem(`taylor-row-columns-${this.props.row}`) || 3;
    return columns;
  }

  arrowStateChanged(column, direction, text, text2, type) {
    this.props.arrowStateChanged(column, direction, text, text2, type);
  }

  arrowDeleted(column, direction) {
    this.props.arrowDeleted(column, direction);
  }

  render() {
    const cells = [];

    for (let column = 1; column <= this.state.columns; column += 1) {
      let cellText = '';
      if (this.state !== undefined && this.state.rowText !== undefined) {
        cellText = this.state.rowText[this.state.row.toString() + column.toString()];
      }
      const arrowObject = this.state.arrowObject[this.state.row.toString() + column.toString()];
      //console.log(arrowObject);
      cells.push(
        <div key={column} className="taylor-cell-container">
          <TaylorCell
            arrowStateChanged={(direction, text, text2, type) =>
              this.arrowStateChanged(column, direction, text, text2, type)
            }
            arrowDeleted={(direction) => this.arrowDeleted(column, direction)}
            row={this.state.row}
            column={column}
            cellText={cellText}
            arrowObject={JSON.stringify(arrowObject)}
            cellTextChanged={this.props.cellTextChanged}
          />
        </div>,
      );
    }
    return (
      <div className="taylor-row-container">
        <div className="taylor-row-size">
          <label htmlFor="taylor-row">
            <p>Columns: {this.state.columns}</p>
            <input
              id="taylor-row"
              type="range"
              min="1"
              max="10"
              value={this.state.columns}
              onChange={this.onColumnsChange}
            />
          </label>
        </div>
        {cells}
      </div>
    );
  }
}

export default TaylorRow;
