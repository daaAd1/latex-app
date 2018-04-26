import React from 'react';
// import PropTypes from 'prop-types';
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
    let leftClassName = '';
    let centerClassName = '';
    let rightClassName = '';
    if (this.state.alignment === 'left') {
      leftClassName = 'table-left-aligned';
    } else if (this.state.alignment === 'center') {
      centerClassName = 'table-center-aligned';
    } else if (this.state.alignment === 'right') {
      rightClassName = 'table-right-aligned';
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

export default TableAlignmentCell;
