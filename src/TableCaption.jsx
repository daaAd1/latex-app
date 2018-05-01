import React from 'react';
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
