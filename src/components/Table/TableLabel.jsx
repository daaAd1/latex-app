import React from 'react';
import PropTypes from 'prop-types';

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
Pri zmene označenia tabuľky, pošle rodičovi novú hodnotu,
ten si ju uloží a vygeneruje nový LaTeX kód.
*/

/*  global console: false, */

class TableLabel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.changeLabel(event.target.value);
  }

  render() {
    return (
      <div className="table-label-container">
        <label htmlFor="table-label">
          Label
          <input value={this.props.label} type="text" id="table-label" onChange={this.onChange} />
        </label>
      </div>
    );
  }
}

TableLabel.propTypes = {
  label: PropTypes.string,

  changeLabel: PropTypes.func.isRequired,
};

TableLabel.defaultProps = {
  label: '',
};

export default TableLabel;
