import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableInputCell
**
*/

/*
Komponent, ktorý sa stará o vstupné polia tabuľky.
*/

/*
Od rodiča dostáva tento komponent číslo riadku, číslo stĺpca, text a zarovnanie. Po zmene textu
vo vstupnom poli pošle rodičovi novú hodnotu, riadok a stĺpec. Ten si hodnotu uloží a vygeneruje nový
LaTeX kód.
*/

class TableInputCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.changedText(event.target.value, this.props.row, this.props.column);
  }

  render() {
    let className;
    if (this.props.alignment === 'left') {
      className = ' table-left-aligned ';
    } else if (this.props.alignment === 'center') {
      className = ' table-center-aligned ';
    } else if (this.props.alignment === 'right') {
      className = ' table-right-aligned ';
    }
    const cellId = `${this.props.row}-${this.props.column}`;
    return (
      <td className="td">
        <TextareaAutosize
          className={className}
          type="text"
          id={cellId}
          value={this.props.text}
          onChange={this.onChange}
        />
      </td>
    );
  }
}

TableInputCell.propTypes = {
  alignment: PropTypes.string,

  row: PropTypes.number.isRequired,
  column: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  changedText: PropTypes.func.isRequired,
};

TableInputCell.defaultProps = {
  alignment: 'left',
};

export default TableInputCell;
