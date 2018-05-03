import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import './App.css';
import Table from './Table';
import SequenceMath from './SequenceMath';
import TaylorDiagram from './TaylorDiagram';

import Nav from './Nav';

export const App = () => {
  return (
    <HashRouter>
      <div>
        <Nav />
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
