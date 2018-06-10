import React from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../firebase';

const PasswordForgetPage = () => (
  <div>
    <h1 className="password-reset-h1">Reset your password</h1>
    <PasswordForgetForm />
  </div>
);

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

const emailRegularExpresion = new RegExp('[^@]+@[^@]+\\.[^@]+');

class PasswordForgetForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth
      .doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  };

  render() {
    const { email, error } = this.state;
    const isInvalid = email === '';
    let emailState = '';
    if (emailRegularExpresion.test(this.state.email)) {
      emailState = 'password-reset-email-good';
    }
    if (
      (error && error.message.includes('email')) ||
      (!emailRegularExpresion.test(this.state.email) && this.state.email.length > 0)
    ) {
      emailState = 'password-reset-email-not-good';
    }

    return (
      <div>
        {error && <p className="password-reset-error-message">{error.message}</p>}
        <form className="password-reset-form" onSubmit={this.onSubmit}>
          <label htmlFor="password-reset-email">
            <p className="password-reset-p">Email</p>
            <input
              id="password-reset-email"
              value={email}
              onChange={(event) => this.setState(byPropKey('email', event.target.value))}
              type="text"
              className={emailState}
              placeholder="Email Address"
            />
            {!emailRegularExpresion.test(this.state.email) &&
              this.state.email !== '' && (
                <p className="password-reset-email-invalid">this email is invalid</p>
              )}
          </label>
          <button className="basic-button" disabled={isInvalid} type="submit">
            Reset My Password
          </button>
        </form>
      </div>
    );
  }
}

class PasswordForgetLink extends React.Component {
  render() {
    return (
      <p className="password-forget">
        <NavLink to="/pw-forget">Forgot Password?</NavLink>
      </p>
    );
  }
}

export default PasswordForgetPage;

export { PasswordForgetForm, PasswordForgetLink };
