import React from 'react';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableCaption
**
*/

/*  global localStorage: false, console: false, */

class ProjectName extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      name: this.getInitialName(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      name: event.target.value,
    });
    localStorage.setItem(`${this.state.type}-project-name`, event.target.value);
    this.props.projectNameChanged(event.target.value);
  }

  getInitialName() {
    const name = localStorage.getItem(`${this.props.type}-project-name`) || `${this.props.type}`;
    return name;
  }

  render() {
    return (
      <div className="project-name-container">
        <label htmlFor="project-name">
          Project name
          <input value={this.state.name} type="text" id="project-name" onChange={this.onChange} />
        </label>
      </div>
    );
  }
}

export default ProjectName;
