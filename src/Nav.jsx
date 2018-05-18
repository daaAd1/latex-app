import React from 'react';
import { NavLink } from 'react-router-dom';
import tableIcon from './table.svg';
import tableActiveIcon from './table-active.svg';
import taylorIcon from './chart-pie.svg';
import taylorActiveIcon from './chart-pie-active.svg';
import mathIcon from './sequence.svg';
import mathActiveIcon from './sequence-active.svg';
import SignOutButton from './SignOut';
import * as routes from './constants/routes';
import { auth } from './firebase';
import * as firebase from 'firebase';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: Nav
**
*/

/*
Komponent, ktorý predstavuje menu aplikácie. Zobrazuje hornú čast stránky 
a prepínanie medzi jednotlivými časťami aplikácie. V menu pri kliku na aplikácie
sa označí kliknutá časť oranžovou farbou, aby používateľ vedel, na ktorej časti sa nachádza.
*/

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableActive: true,
      sequenceActive: false,
      taylorActive: false,
      userLoggedIn: false,
    };

    this.tableClicked = this.tableClicked.bind(this);
    this.sequenceActive = this.sequenceClicked.bind(this);
    this.taylorClicked = this.taylorClicked.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          userLoggedIn: true,
        });
      }
    });
  }

  tableClicked() {
    this.setState({
      tableActive: true,
      sequenceActive: false,
      taylorActive: false,
    });
  }

  sequenceClicked() {
    this.setState({
      tableActive: false,
      sequenceActive: true,
      taylorActive: false,
    });
  }

  taylorClicked() {
    this.setState({
      tableActive: false,
      sequenceActive: false,
      taylorActive: true,
    });
  }

  render() {
    return (
      <div className="header-container">
        <div className="header-docs-container">
          <NavLink onClick={this.tableClicked.bind(this)} className="header" exact to="/">
            LaTeX generator
          </NavLink>
          <NavLink className="docs-link" exact to="/docs">
            Documentation
          </NavLink>
          {!this.state.userLoggedIn && <NavLink to={routes.SIGN_IN}>Sign In</NavLink>}
          {this.state.userLoggedIn && <SignOutButton />}
          {this.state.userLoggedIn && <NavLink to={routes.SAVED_WORKS}>Saved works </NavLink>}
        </div>
        <ul className="header-nav">
          <li>
            <NavLink onClick={this.tableClicked.bind(this)} exact to="/table">
              {!this.state.tableActive && <img src={tableIcon} alt="table-icon" />}
              {this.state.tableActive && <img src={tableActiveIcon} alt="table-active-icon" />}
            </NavLink>
          </li>
          <li>
            <NavLink onClick={this.sequenceClicked.bind(this)} to="/math">
              {!this.state.sequenceActive && <img src={mathIcon} alt="math-icon" />}
              {this.state.sequenceActive && <img src={mathActiveIcon} alt="math-active-icon" />}
            </NavLink>
          </li>
          <li>
            <NavLink onClick={this.taylorClicked.bind(this)} to="/taylor">
              {!this.state.taylorActive && <img src={taylorIcon} alt="taylor-icon" />}
              {this.state.taylorActive && <img src={taylorActiveIcon} alt="taylor-active-icon" />}
            </NavLink>
          </li>
        </ul>
        <ul className="header-nav-labels">
          <li
            onClick={this.tableClicked.bind(this)}
            className={this.state.tableActive ? 'table-label page-active' : ' table-label '}
          >
            {' '}
            <NavLink exact to={routes.TABLE}>
              Table
            </NavLink>{' '}
          </li>
          <li
            onClick={this.sequenceClicked.bind(this)}
            className={this.state.sequenceActive ? 'math-label page-active' : ' math-label '}
          >
            {' '}
            <NavLink to={routes.MATH}>Math</NavLink>{' '}
          </li>
          <li
            onClick={this.taylorClicked.bind(this)}
            className={this.state.taylorActive ? 'taylor-label page-active' : ' taylor-label '}
          >
            <NavLink to={routes.TAYLOR}>Taylor</NavLink>
          </li>
        </ul>
      </div>
    );
  }
}

export default Nav;
