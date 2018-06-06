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

/*  global localStorage: false, console: false, */

class TableAlignmentCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: props.column,
      alignment: this.getInitialAlignment(),
    };

    this.clickLeft = this.clickLeft.bind(this);
    this.clickCenter = this.clickCenter.bind(this);
    this.clickRight = this.clickRight.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.alignment !== nextProps.alignment) {
      this.setState({
        alignment: nextProps.alignment,
      });
    }
  }

  getInitialAlignment() {
    const alignment = localStorage.getItem(`table-alignment-${this.props.column}`) || 'left';
    return alignment;
  }

  clickLeft() {
    this.setState({
      alignment: 'left',
    });
    localStorage.setItem(`table-alignment-${this.state.column}`, 'left');
    this.props.onClick();
  }

  clickCenter() {
    this.setState({
      alignment: 'center',
    });
    localStorage.setItem(`table-alignment-${this.state.column}`, 'center');
    this.props.onClick();
  }

  clickRight() {
    this.setState({
      alignment: 'right',
    });
    localStorage.setItem(`table-alignment-${this.state.column}`, 'right');
    this.props.onClick();
  }

  render() {
    let leftClassName = ' table-align-button ';
    let centerClassName = ' table-align-button ';
    let rightClassName = ' table-align-button ';
    if (this.state.alignment === 'left') {
      leftClassName += ' table-button-left ';
    } else if (this.state.alignment === 'center') {
      centerClassName += ' table-button-center ';
    } else if (this.state.alignment === 'right') {
      rightClassName += ' table-button-right ';
    }

    return (
      <td className="table-alignment">
        <button className={leftClassName} onClick={this.clickLeft}>
          l
        </button>
        <button className={centerClassName} onClick={this.clickCenter}>
          c
        </button>
        <button className={rightClassName} onClick={this.clickRight}>
          r
        </button>
      </td>
    );
  }
}

TableAlignmentCell.propTypes = {
  alignment: PropTypes.string,

  column: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

TableAlignmentCell.defaultProps = {
  alignment: '',
};

export default TableAlignmentCell;
