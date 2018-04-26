import React from 'react';
/*  global localStorage: false, console: false, */

class TableLabel extends React.Component {
  static getInitialLabel() {
    const label = localStorage.getItem('table-label') || '';
    return label;
  }

  constructor(props) {
    super(props);
    this.state = {
      label: this.getInitialLabel(),
    };

    this.onChange = this.onChange.bind(this);
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
