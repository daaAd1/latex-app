import React from 'react';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableBorderCell
**
*/

/*
Komponent, ktorý má na starosti hranice tabuľky.
*/

/*
Komponent dostáva od rodiča číslo riadku, číslo stĺpca a smer hranice,
ktorý môže byť riadok alebo stĺpec.
Pri kliknutí na hranicu volá funkciu rodiča,
 ktorý si nový stav hranice uloží a vygeneruje LaTeX kód.
*/

/*  global console: false, */

class TableBorderCell extends React.PureComponent {
  render() {
    const { row, column, direction, active, hover } = this.props;
    const className =
      ((active || hover) && `table-border-${direction} table-active-border`) ||
      `table-border-${direction}`;
    return (
      <td
        role="gridcell"
        onMouseEnter={this.props.onMouseEnter}
        id={`${row}-${column}`}
        className={className}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}
      />
    );
  }
}

TableBorderCell.propTypes = {
  active: PropTypes.bool,
  hover: PropTypes.bool,

  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

TableBorderCell.defaultProps = {
  active: false,
  hover: false,
};

export default TableBorderCell;
