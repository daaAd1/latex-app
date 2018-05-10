import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import './App.css';
import Table from './Table';
import SequenceMath from './SequenceMath';
import TaylorDiagram from './TaylorDiagram';
import Documentation from './Documentation';
import Nav from './Nav';

/*
**
Autor: Samuel Sepeši
Dátum: 10.5.2018
Komponent: App
**
*/

/*
Hlavný komponent aplikácie, má na starosti prepínanie medzi časťami aplikácie.
Používam HashRouter a Route na navigáciu medzi jednotlivými časťami aplikácie.
Tieto komponenty zabezpečujú,  
že stránka sa nepotrebuje obnoviť pri navigovaní na inú časť aplikácie.
*/

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Nav />
          <div className="content">
            <Route exact path="/" component={Table} />
            <Route exact path="/math" component={SequenceMath} />
            <Route exact path="/taylor" component={TaylorDiagram} />
            <Route exact path="/docs" component={Documentation} />
          </div>
        </div>
      </HashRouter>
    );
  }
}

/*export const App = () => {
  return (
    <HashRouter>
      <div>
        <Nav />
        <div className="content">
          <Route exact path="/" component={Table} />
          <Route exact path="/math" component={SequenceMath} />
          <Route exact path="/taylor" component={TaylorDiagram} />
          <Route exact path="/docs" component={Documentation} />
        </div>
      </div>
    </HashRouter>
  );
};*/

export default App;
