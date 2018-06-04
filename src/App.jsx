import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import './App.css';
import Table from './Table';
import SequenceMath from './SequenceMath';
import TaylorDiagram from './TaylorDiagram';
import Documentation from './Documentation';
import Nav from './Nav';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PasswordForgetPage from './PasswordForget';
import * as routes from './constants/routes';
import { firebase } from './firebase';
import SavedWorksContainer from './SavedWorks';
import HomePage from './Home';

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
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser ? this.setState(() => ({ authUser })) : this.setState(() => ({ authUser: null }));
    });
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Nav />
          <div className="content">
            <Route exact path={routes.HOME} component={() => <HomePage />} />
            <Route exact path={routes.TABLE} component={() => <Table />} />
            <Route exact path={routes.MATH} component={() => <SequenceMath />} />
            <Route exact path={routes.TAYLOR} component={() => <TaylorDiagram />} />
            <Route exact path={routes.DOCS} component={() => <Documentation />} />
            <Route exact path={routes.SIGN_IN} component={() => <SignIn />} />
            <Route exact path={routes.SIGN_UP} component={() => <SignUp />} />
            <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
            <Route exact path={routes.SAVED_WORKS} component={() => <SavedWorksContainer />} />
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
