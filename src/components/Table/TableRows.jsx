import React from 'react';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableRows
**
*/

/*
Komponent, ktorý sa stará o počet riadkov v tabuľke. Vstupné pole je typu škála.
*/

/*
Pri zmene počtu riadkov odošle rodičovi novú hodnotu riadkov, ktorý si ju uloží, 
zmení veľkosť tabuľky a vygeneruje nový kód.
*/

/*  global console: false, */

class TableRows extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let { value } = event.target;
    if (value < 1) {
      value = 1;
    } else if (value > 25) {
      value = 25;
    }
    this.props.rowValue(value);
  }

  render() {
    return (
      <div className=" table-row-size ">
        <label htmlFor="table-rows">
          Rows: {this.props.rows}
          <input
            id="table-rows"
            type="range"
            min="1"
            max="25"
            value={this.props.rows}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

TableRows.propTypes = {
  rows: PropTypes.number,

  rowValue: PropTypes.func.isRequired,
};

TableRows.defaultProps = {
  rows: 5,
};

export default TableRows;
