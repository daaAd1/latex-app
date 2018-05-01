import React from 'react';
/*  global localStorage: false, console: false, */

class TableColumns extends React.PureComponent {
  static getInitialColumnsState() {
    let columns = 5;
    if (localStorage.getItem('table-columns') !== null) {
      columns = (localStorage.getItem('table-columns') - 1) / 2;
    }
    return columns;
  }

  constructor(props) {
    super(props);
    this.state = {
      columns: TableColumns.getInitialColumnsState(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    if (event.target.value < 1) {
      this.setState({
        columns: 1,
      });
      this.props.columnValue(1);
    } else if (event.target.value > 15) {
      this.setState({
        columns: 15,
      });
      this.props.columnValue(15);
    } else {
      this.setState({
        columns: event.target.value,
      });
      this.props.columnValue(event.target.value);
    }
  }

  render() {
    return (
      <div className=" table-column-size">
        <label htmlFor="table-columns">
          Columns: {this.state.columns}
          <input
            id="table-columns"
            type="range"
            min="1"
            max="15"
            value={this.state.columns}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

export default TableColumns;
