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

/*  global localStorage: false, console: false, */

class TableRows extends React.PureComponent {
  static getInitialRowsState() {
    let rows = 5;
    if (localStorage.getItem('table-rows') !== null) {
      rows = (localStorage.getItem('table-rows') - 1) / 2;
    }
    return rows;
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: TableRows.getInitialRowsState(),
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.state.rows) {
      this.setState({ rows: nextProps.rows });
    }
  }

  onChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1,
      });
      this.props.rowValue(1);
    } else if (event.target.value > 25) {
      this.setState({
        rows: 25,
      });
      this.props.rowValue(25);
    } else {
      this.setState({
        rows: event.target.value,
      });
      this.props.rowValue(event.target.value);
    }
  }

  render() {
    return (
      <div className=" table-row-size ">
        <label htmlFor="table-rows">
          Rows: {this.state.rows}
          <input
            id="table-rows"
            type="range"
            min="1"
            max="25"
            value={this.state.rows}
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
