import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { auth, db } from './firebase';
import * as routes from './constants/routes';

const SignUpPage = ({ history }) => (
  <div>
    <h1 className=".sign-up-h1">Register your account</h1>
    <SignUpForm history={history} />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const emailRegularExpresion = new RegExp('[^@]+@[^@]+\\.[^@]+');

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { username, email, passwordOne } = this.state;
    const { history } = this.props;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create a user in your own accessible Firebase Database too
        db
          .doCreateUser(authUser.user.uid, username, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.TABLE);
          })
          .catch((error) => {
            this.setState(byPropKey('error', error));
          });
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });
    event.preventDefault();
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === '';

    let usernameState = '';
    if (this.state.username.length > 0) {
      usernameState = 'sign-up-username-good';
    }
    let emailState = '';
    if (emailRegularExpresion.test(this.state.email)) {
      emailState = 'sign-up-email-good';
    }
    if (
      (error && error.message.includes('email')) ||
      (!emailRegularExpresion.test(this.state.email) && this.state.email.length > 0)
    ) {
      emailState = 'sign-up-email-not-good';
    }
    let passwordOneState = '';
    let passwordTwoState = '';
    if (this.state.passwordOne.length > 5 && this.state.passwordOne === this.state.passwordTwo) {
      passwordOneState = 'sign-up-password-good';
      passwordTwoState = 'sign-up-password-good';
    }
    if (this.state.passwordOne.length > 0 && this.state.passwordOne !== this.state.passwordTwo) {
      passwordOneState = 'sign-up-password-not-good';
      passwordTwoState = 'sign-up-password-not-good';
    }
    if (this.state.passwordOne.length > 0 && this.state.passwordOne.length < 6) {
      passwordOneState = 'sign-up-password-not-good';
    }
    if (this.state.passwordTwo.length > 0 && this.state.passwordTwo.length < 6) {
      passwordTwoState = 'sign-up-password-not-good';
    }
    if (error && error.message.includes('password')) {
      passwordOneState = 'sign-up-password-not-good';
      passwordTwoState = 'sign-up-password-not-good';
    }

    return (
      <form className="sign-up-form" onSubmit={this.onSubmit}>
        {error && <p className="sign-up-error-message">{error.message}</p>}{' '}
        <label htmlFor="sign-up-name">
          <p className="sign-up-p">Name</p>
          <input
            id="sign-up-name"
            value={username}
            onChange={(event) => this.setState(byPropKey('username', event.target.value))}
            type="text"
            className={usernameState}
            placeholder="John Doe or jdoe"
          />
        </label>
        <label htmlFor="sign-up-email">
          <p className="sign-up-p">Email</p>
          <input
            id="sign-up-email"
            value={email}
            onChange={(event) => this.setState(byPropKey('email', event.target.value))}
            type="text"
            className={emailState}
            placeholder="johnsmith@email.com"
          />
          {!emailRegularExpresion.test(this.state.email) &&
            this.state.email !== '' && (
              <p className="sign-up-password-short">this email is invalid</p>
            )}
        </label>
        <label htmlFor="sign-up-password">
          <p className="sign-up-p">Password</p>
          <p className="sign-up-password-requirement">at least 6 characters</p>

          <input
            id="sign-up-password"
            value={passwordOne}
            onChange={(event) => this.setState(byPropKey('passwordOne', event.target.value))}
            type="password"
            className={passwordOneState}
            placeholder="Password"
          />

          {this.state.passwordOne.length < 6 &&
            this.state.passwordOne !== '' && (
              <p className="sign-up-password-short">password too short</p>
            )}
        </label>
        <label htmlFor="sign-up-confirm-password">
          <p className="sign-up-p">Confirm password</p>
          <p className="sign-up-password-requirement">at least 6 characters</p>

          <input
            id="sign-up-confirm-password"
            value={passwordTwo}
            onChange={(event) => this.setState(byPropKey('passwordTwo', event.target.value))}
            type="password"
            className={passwordTwoState}
            placeholder="Confirm Password"
          />

          {this.state.passwordOne !== this.state.passwordTwo &&
            this.state.passwordOne !== '' &&
            this.state.passwordTwo !== '' && (
              <p className="sign-up-password-short">passwords don't match</p>
            )}
        </label>
        <button className="basic-button" disabled={isInvalid} type="submit">
          Sign Up
        </button>
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="password-forget">
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };
