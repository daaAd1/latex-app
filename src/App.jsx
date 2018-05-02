import React from 'react';
import { Route, NavLink, HashRouter } from 'react-router-dom';
import './App.css';
import tableIcon from './table.svg';
import taylorIcon from './chart-pie.svg';
import mathIcon from './sequence.svg';
import Table from './Table';
import SequenceMath from './SequenceMath';
import TaylorDiagram from './TaylorDiagram';

export const App = () => {
  return (
    <HashRouter>
      <div>
        <div className="header-container">
          <h1 className="header">LaTeX generator</h1>
          <ul className="header-nav">
            <li id="table">
              <NavLink exact to="/">
                <img src={tableIcon} alt="table-icon" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/math">
                <img src={mathIcon} alt="math-icon" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/taylor">
                <img src={taylorIcon} alt="taylor-icon" />
              </NavLink>
            </li>
          </ul>
          <ul className="header-nav-labels">
            <li className="table-label">
              {' '}
              <NavLink exact to="/">
                Table
              </NavLink>{' '}
            </li>
            <li className="math-label">
              {' '}
              <NavLink to="/math">Math</NavLink>{' '}
            </li>
            <li className="taylor-label">
              <NavLink to="/taylor">Taylor</NavLink>
            </li>
          </ul>
        </div>
        <div className="content">
          <Route exact path="/" component={Table} />
          <Route path="/math" component={SequenceMath} />
          <Route path="/taylor" component={TaylorDiagram} />
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
