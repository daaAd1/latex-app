import React from 'react';
import PropTypes from 'prop-types';
/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableAlignmentCell
**
*/

/*
Komponent, ktorý má na starosti zarovnávanie textu v jednotlivých stĺpcoch.
Pozostáva z troch tlačidiel l, c a r, ktoré značia zarovnanie vľavo, do stredu a vpravo.
*/

/*
Komponent dostáva od rodiča číslo stĺpca.  Pri zmene zarovnania volá funkciu onClick rodiča, 
ktorý sa postará o zmenu LaTeX kódu.
*/

/*  global console: false, */

class TableAlignmentCell extends React.PureComponent {
  render() {
    const { alignment } = this.props;
    const baseClassName = ' table-align-button ';
    const activeClassName = ' table-align-button alignment-active ';
    const leftClassName = (alignment === 'left' && activeClassName) || baseClassName;
    const centerClassName = (alignment === 'center' && activeClassName) || baseClassName;
    const rightClassName = (alignment === 'right' && activeClassName) || baseClassName;
    return (
      <td className="table-alignment">
        <button className={leftClassName} onClick={() => this.props.onClick('left')}>
          l
        </button>
        <button className={centerClassName} onClick={() => this.props.onClick('center')}>
          c
        </button>
        <button className={rightClassName} onClick={() => this.props.onClick('right')}>
          r
        </button>
      </td>
    );
  }
}

TableAlignmentCell.propTypes = {
  alignment: PropTypes.string,

  onClick: PropTypes.func.isRequired,
};

TableAlignmentCell.defaultProps = {
  alignment: 'left',
};

export default TableAlignmentCell;
