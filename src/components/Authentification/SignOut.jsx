import React from 'react';
import { auth } from '../../firebase';

/*  global console: false, window: false */

class SignOutButton extends React.Component {
  static onSignOut() {
    auth.doSignOut();
    window.location.reload();
  }

  render() {
    return (
      <button className="sign-out-button" type="button" onClick={SignOutButton.onSignOut}>
        Sign Out
      </button>
    );
  }
}

export default SignOutButton;
