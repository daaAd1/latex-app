import React from 'react';
import { withRouter } from 'react-router-dom';

import { PasswordForgetLink } from './PasswordForget';
import { SignUpLink } from './SignUp';
import { auth } from '../../firebase';
import * as routes from '../../constants/routes';

const SignInPage = ({ history }) => (
  <div>
    <h1 className="sign-in-h1">Sign in to your account</h1>
    <SignInForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;

    const { history } = this.props;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.TABLE);
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form className="sign-in-form" onSubmit={this.onSubmit}>
        {error && <p className="sign-in-error-message">{error.message}</p>}
        <label htmlFor="sign-in-email-label">
          <p className="sign-in-p">Email</p>
          <input
            id="sign-in-email-label"
            value={email}
            onChange={(event) => this.setState(byPropKey('email', event.target.value))}
            type="text"
            placeholder="johnsmith@email.com"
          />
        </label>
        <label htmlFor="sign-in-password-label">
          <p className="sign-in-p">Password</p>
          <input
            id="sign-in-password-label"
            value={password}
            onChange={(event) => this.setState(byPropKey('password', event.target.value))}
            type="password"
            placeholder="password"
          />
        </label>

        <button className="basic-button" disabled={isInvalid} type="submit">
          Sign In
        </button>
      </form>
    );
  }
}

export default withRouter(SignInPage);

export { SignInForm };
