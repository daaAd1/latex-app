import React from 'react';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableColumns
**
*/

/*
Komponent, ktorý sa stará o počet stĺpcov v tabuľke. Vstupné pole je typu škála.
*/

/*
Po zmene počtu stĺpcov volá rodičovskú funkciu s aktualizovanou hodnotou stĺpcou. 
Rodič si hodnotu uloží, zväčší alebo zmenší tabuľku a vygeneruje nový LaTeX kód.
*/

/*  global console: false, */

class TableColumns extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let { value } = event.target;
    if (value < 1) {
      value = 1;
    } else if (value > 15) {
      value = 15;
    }
    this.props.columnValue(value);
  }

  render() {
    return (
      <div className=" table-column-size">
        <label htmlFor="table-columns">
          Columns: {this.props.columns}
          <input
            id="table-columns"
            type="range"
            min="1"
            max="15"
            value={this.props.columns}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

TableColumns.propTypes = {
  columns: PropTypes.number,

  columnValue: PropTypes.func.isRequired,
};

TableColumns.defaultProps = {
  columns: 5,
};

export default TableColumns;
