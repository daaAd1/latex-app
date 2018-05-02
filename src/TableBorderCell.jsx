import React from 'react';
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

  getInitialBorderState() {
    const border =
      localStorage.getItem(`table-border-row${this.props.row}-column${this.props.column}`) || false;
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
