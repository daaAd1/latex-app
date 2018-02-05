import React, { Component } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
//import logo from './logo.svg';
import './App.css';
import tableIcon from "./table-large.png";
import taylorIcon from "./chart-pie.png";
import mathIcon from "./currency-eth.png";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Table from "./Table"
import SequenceMath from "./SequenceMath";
import TaylorDiagram from "./TaylorDiagram";

class App extends Component {
  render() {
    return (
      <HashRouter>
      <div>
      <h1>LaTeX generator</h1>
        <ul className="header">
          <li><NavLink exact to="/"><img src={tableIcon} alt="table-icon"/></NavLink></li>
          <li><NavLink to="/math"><img src={mathIcon} alt="math-icon"/></NavLink></li>
          <li><NavLink to="/taylor"><img src={taylorIcon} alt="taylor-icon"/></NavLink></li>
        </ul>
        <div className="content">
          <Route exact path="/" component={Table}/>
          <Route path="/math" component={SequenceMath}/>
          <Route path="/taylor" component={TaylorDiagram}/>
        </div>
      </div>
    </HashRouter>
    );
  }
}

export default App;
