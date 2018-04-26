import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import Arrow from './Arrow';

/*  global console: false, */

class TaylorCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      row: props.row,
      column: props.column,
      cellText: props.cellText,
    };

    this.cellTextChanged = this.cellTextChanged.bind(this);
    this.arrowStateChanged = this.arrowStateChanged.bind(this);
    this.arrowDeleted = this.arrowDeleted.bind(this);
  }

  cellTextChanged(event) {
    this.setState({
      cellText: event.target.value,
    });
    this.props.cellTextChanged(event.target.value, this.state.row, this.state.column);
  }

  arrowStateChanged(direction, text, text2, type) {
    this.props.arrowStateChanged(direction, text, text2, type);
  }

  arrowDeleted(direction) {
    this.props.arrowDeleted(direction);
  }

  render() {
    return (
      <div className="taylor-cell-container">
        <div className="taylor-arrow-container">
          <Arrow
            arrowDirection="lu"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="u"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="ru"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="l"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="r"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="ld"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="d"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
          <Arrow
            arrowDirection="rd"
            arrowDeleted={this.arrowDeleted}
            arrowActivated={this.arrowStateChanged}
            row={this.state.row}
            column={this.state.column}
          />
        </div>
        <TextareaAutosize
          type="text"
          value={this.state.cellText}
          className="taylor-cell-input"
          onChange={this.cellTextChanged}
        />
      </div>
    );
  }
}

export default TaylorCell;
