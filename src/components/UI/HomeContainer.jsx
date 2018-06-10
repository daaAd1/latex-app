import React from 'react';
import firebase from 'firebase/app';
import HomePage from './Home';

class HomeContainer extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ isSignedIn: !!user });
      } else {
        this.setState({ isSignedIn: false });
      }
    });
  }

  render() {
    return <HomePage isSignedIn={this.state.isSignedIn} />;
  }
}

export default HomeContainer;
