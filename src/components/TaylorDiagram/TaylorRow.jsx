import React from 'react';
import PropTypes from 'prop-types';
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
  static checkColumnsValue(columns) {
    if (columns < 1) {
      return 1;
    } else if (columns > 10) {
      return 10;
    }
    return columns;
  }

  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      columns: this.getInitialColumns(),
      rowTextObject: this.getInitialRowTextObject(),
      arrowPropertiesObject: JSON.parse(props.arrowPropertiesObject),
    };

    this.handleColumnsChange = this.handleColumnsChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { columns, rowTextObject, arrowPropertiesObject } = nextProps;
    if (
      rowTextObject !== JSON.stringify(this.state.rowTextObject) ||
      arrowPropertiesObject !== JSON.stringify(this.state.arrowPropertiesObject) ||
      columns !== this.state.columns
    ) {
      this.setReceivedProps(columns, JSON.parse(rowTextObject), JSON.parse(arrowPropertiesObject));
    }
  }

  setReceivedProps(columns, rowTextObject, arrowPropertiesObject) {
    this.setState({
      columns,
      rowTextObject,
      arrowPropertiesObject,
    });
  }

  getInitialRowTextObject() {
    return (
      localStorage.getItem(`taylor-row-text-${this.props.row}`) ||
      JSON.parse(this.props.rowTextObject)
    );
  }

  getInitialColumns() {
    return localStorage.getItem(`taylor-row-columns-${this.props.row}`) || 3;
  }

  handleColumnsChange(event) {
    let columns = TaylorRow.checkColumnsValue(event.target.value);
    this.setStateColumns(columns);
    this.setLocalStorageColumns(columns);
    this.props.onColumnsChange(columns);
  }

  setStateColumns(columns) {
    this.setState({
      columns,
    });
  }

  setLocalStorageColumns(columns) {
    localStorage.setItem(`taylor-row-columns-${this.props.row}`, columns);
  }

  render() {
    const cells = [];
    for (let column = 1; column <= this.state.columns; column += 1) {
      let cellText = '';
      if (this.state !== undefined && this.state.rowTextObject !== undefined) {
        cellText = this.state.rowTextObject[this.state.row.toString() + column.toString()];
      }
      const arrowPropertiesObject = this.state.arrowPropertiesObject[
        this.state.row.toString() + column.toString()
      ];
      cells.push(
        <div key={column} className="taylor-cell-container">
          <TaylorCell
            onArrowChange={(direction, text, text2, type) =>
              this.props.onArrowChange(column, direction, text, text2, type)
            }
            onArrowDelete={(direction) => this.props.onArrowDelete(column, direction)}
            row={this.state.row}
            column={column}
            text={cellText}
            arrowPropertiesObject={JSON.stringify(arrowPropertiesObject)}
            onTextChange={this.props.onCellTextChange}
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
              onChange={this.handleColumnsChange}
            />
          </label>
        </div>
        {cells}
      </div>
    );
  }
}

TaylorRow.propTypes = {
  arrowPropertiesObject: PropTypes.string,
  rowTextObject: PropTypes.string,
  columns: PropTypes.number,

  row: PropTypes.number.isRequired,
  onArrowChange: PropTypes.func.isRequired,
  onArrowDelete: PropTypes.func.isRequired,
};

TaylorRow.defaultProps = {
  arrowPropertiesObject: {},
  rowTextObject: {},
  columns: 3,
};

export default TaylorRow;
