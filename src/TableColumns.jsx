import React from 'react';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableColumns
**
*/

/*
Komponent, ktorý sa stará o počet stĺpcov v tabuľke. Vstupné pole je typu škála.
*/

/*
Po zmene počtu stĺpcov volá rodičovskú funkciu s aktualizovanou hodnotou stĺpcou. 
Rodič si hodnotu uloží, zväčší alebo zmenší tabuľku a vygeneruje nový LaTeX kód.
*/

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.columns !== this.state.columns) {
      this.setState({ columns: nextProps.columns });
    }
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
