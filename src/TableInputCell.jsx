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

class TableInputCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      text: props.text,
      alignment: props.alignment,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.alignment !== this.state.alignment) {
      this.setState({ alignment: nextProps.alignment });
    }
    if (nextProps.text !== this.state.text) {
      this.setState({ text: nextProps.text });
    }
  }

  onChange(event) {
    this.setState({
      text: event.target.value,
    });
    this.props.changedText(event.target.value, this.state.row, this.state.column);
  }

  render() {
    let className;
    if (this.state.alignment === 'left') {
      className = ' table-left-aligned ';
    } else if (this.state.alignment === 'center') {
      className = ' table-center-aligned ';
    } else if (this.state.alignment === 'right') {
      className = ' table-right-aligned ';
    }
    const cellId = `${this.state.row}-${this.state.column}`;
    return (
      <TextareaAutosize
        className={className}
        type="text"
        id={cellId}
        value={this.state.text}
        onChange={this.onChange}
      />
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
