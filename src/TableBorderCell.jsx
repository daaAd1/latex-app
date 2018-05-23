import React from 'react';

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
Komponent dostáva od rodiča číslo riadku, číslo stĺpca a smer hranice, ktorý môže byť riadok alebo stĺpec.
Pri kliknutí na hranicu volá funkciu rodiča, ktorý si nový stav hranice uloží a vygeneruje LaTeX kód.
*/

/*  global localStorage: false, console: false, */

class BorderCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      direction: props.direction,
      active: this.getInitialBorderState(),
      hover: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.active !== nextProps.active) {
      this.setState({
        active: nextProps.active,
      });
    }
  }

  getInitialBorderState() {
    let border =
      localStorage.getItem(`table-border-row${this.props.row}-column${this.props.column}`) || false;
    if (border === 'true') {
      border = true;
    } else {
      border = false;
    }
    return border;
  }

  render() {
    const cellId = `${this.state.row}-${this.state.column}`;

    if (this.state.direction === 'row') {
      this.className = ' table-border-row ';
    } else if (this.state.direction === 'column') {
      this.className = ' table-border-column ';
    }

    if (this.state.active && this.state.active !== 'false') {
      this.className += ' table-active-border ';
    }

    if (this.state.hover) {
      this.className += ' table-hover-border ';
    }

    return (
      <td
        role="gridcell"
        onMouseEnter={this.props.onMouseEnter}
        id={cellId}
        className={this.className}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}
      />
    );
  }
}

export default BorderCell;
