import React from 'react';
import { auth } from './firebase';

class SignOutButton extends React.Component {
  onSignOut() {
    auth.doSignOut();
    window.location.reload();
  }

  render() {
    return (
      <button className="sign-out-button" type="button" onClick={this.onSignOut}>
        Sign Out
      </button>
    );
  }
}

export default SignOutButton;
