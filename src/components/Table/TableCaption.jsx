import React from 'react';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableCaption
**
*/

/*
Komponent, ktorý má na starosti nadpis tabuľky.
*/

/*
Komponent po zmene nadpisu posiela rodičovi novú hodnotu napdisu, ktorú si rodič uloží
a vygeneruje LaTeX kód.
*/

/*  global console: false, */

class TableCaption extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.changeCaption(event.target.value);
  }

  render() {
    return (
      <div className="table-caption-container">
        <label htmlFor="table-caption">
          Caption
          <input
            value={this.props.caption}
            type="text"
            id="table-caption"
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

TableCaption.propTypes = {
  caption: PropTypes.string,

  changeCaption: PropTypes.func.isRequired,
};

TableCaption.defaultProps = {
  caption: '',
};

export default TableCaption;
