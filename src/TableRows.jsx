import React from 'react';
/*  global localStorage: false, console: false, */

class TableRows extends React.PureComponent {
  static getInitialRowsState() {
    let rows = 5;
    if (localStorage.getItem('table-rows') !== null) {
      rows = (localStorage.getItem('table-rows') - 1) / 2;
    }
    return rows;
  }

  constructor(props) {
    super(props);
    this.state = {
      rows: TableRows.getInitialRowsState(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    if (event.target.value < 1) {
      this.setState({
        rows: 1,
      });
      this.props.rowValue(1);
    } else if (event.target.value > 25) {
      this.setState({
        rows: 25,
      });
      this.props.rowValue(25);
    } else {
      this.setState({
        rows: event.target.value,
      });
      this.props.rowValue(event.target.value);
    }
  }

  render() {
    return (
      <div className=" table-row-size ">
        <label htmlFor="table-rows">
          Rows: {this.state.rows}
          <input
            id="table-rows"
            type="range"
            min="1"
            max="25"
            value={this.state.rows}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

export default TableRows;
