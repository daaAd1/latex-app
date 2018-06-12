import React from 'react';
import PropTypes from 'prop-types';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: TableCaption
**
*/

/*  global console: false, */

class ProjectName extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.projectNameChanged(event.target.value);
  }

  render() {
    return (
      <div className="project-name-container">
        <label htmlFor="project-name">
          Project name
          <input value={this.props.name} type="text" id="project-name" onChange={this.onChange} />
        </label>
      </div>
    );
  }
}

ProjectName.propTypes = {
  name: PropTypes.string,

  projectNameChanged: PropTypes.func.isRequired,
};

ProjectName.defaultProps = {
  name: '',
};

export default ProjectName;
