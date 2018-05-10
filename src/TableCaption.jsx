import React from 'react';

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

/*  global localStorage: false, console: false, */

class TableCaption extends React.PureComponent {
  static getInitialCaption() {
    const caption = localStorage.getItem('table-caption') || '';
    return caption;
  }

  constructor(props) {
    super(props);
    this.state = {
      caption: TableCaption.getInitialCaption(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      caption: event.target.value,
    });
    this.props.changeCaption(event.target.value);
  }

  render() {
    return (
      <div className="table-caption-container">
        <label htmlFor="table-caption">
          Caption
          <input
            value={this.state.caption}
            type="text"
            id="table-caption"
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}

export default TableCaption;
