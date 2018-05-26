import React from 'react';

import { auth } from './firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form className="password-forget-form" onSubmit={this.onSubmit}>
        {error && <p className="password-forget-p">{error.message}</p>}
        <label htmlFor="password-forget-password-one">
          <p className="password-forget-p">New password</p>
          <input
            id="password-forget-password-one"
            value={passwordOne}
            onChange={(event) => this.setState(byPropKey('passwordOne', event.target.value))}
            type="password"
            placeholder="New Password"
          />
        </label>
        <label htmlFor="password-forget-password-two">
          <p className="password-forget-p">Confirm new password</p>
          <input
            id="password-forget-password-two"
            value={passwordTwo}
            onChange={(event) => this.setState(byPropKey('passwordTwo', event.target.value))}
            type="password"
            placeholder="Confirm New Password"
          />
        </label>
        <button className="basic-button" disabled={isInvalid} type="submit">
          Reset My Password
        </button>
      </form>
    );
  }
}

export default PasswordChangeForm;
