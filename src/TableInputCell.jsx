import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

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

export default TableInputCell;
