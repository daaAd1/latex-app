import React from 'react';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableLabel
**
*/

/*
Komponent, ktorý má na starosti označenie tabuľky.
*/

/*
Pri zmene označenia tabuľky, pošle rodičovi novú hodnotu, ten si ju uloží a 
vygeneruje nový LaTeX kód.
*/

/*  global localStorage: false, console: false, */

class TableLabel extends React.PureComponent {
  static getInitialLabel() {
    const label = localStorage.getItem('table-label') || '';
    return label;
  }

  constructor(props) {
    super(props);
    this.state = {
      label: TableLabel.getInitialLabel(),
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.label !== this.state.label) {
      this.setState({ label: nextProps.label });
    }
  }

  onChange(event) {
    this.setState({
      label: event.target.value,
    });
    this.props.changeLabel(event.target.value);
  }

  render() {
    return (
      <div className="table-label-container">
        <label htmlFor="table-label">
          Label
          <input value={this.state.label} type="text" id="table-label" onChange={this.onChange} />
        </label>
      </div>
    );
  }
}

export default TableLabel;
