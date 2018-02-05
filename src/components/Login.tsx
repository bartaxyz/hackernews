import * as React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { AUTH_TOKEN } from '../constants';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

class Login extends React.Component<any, any> {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  };

  render() {
    return (
      <div className="form">
        <h2>{this.state.login ? 'Login' : 'Sign Up'}</h2>
        <div className="flex flex-column">
          {!this.state.login && (
            <label className="field field--50">
              <span className="field__label">Your name</span>
              <input
                className="field__input field__input--text"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
                type="text"
              />
            </label>
          )}
          <label className="field field--50">
            <span className="field__label">Email address</span>
            <input
              className="field__input field__input--text"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
              type="text"
            />
          </label>
          <label className="field field--50">
            <span className="field__label">Password</span>
            <input
              className="field__input field__input--text"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              type="password"
            />
          </label>
        </div>
        <button className="button" onClick={() => this._confirm()}>
          {this.state.login ? 'login' : 'create account'}
        </button>
        <button
          className="button"
          onClick={() => this.setState({ login: !this.state.login })}
        >
          {this.state.login
            ? 'need to create an account?'
            : 'already have an account?'}
        </button>
      </div>
    );
  }

  _confirm = async () => {
    const { name, email, password } = this.state;
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      });
      const { token } = result.data.login;
      this._saveUserData(token);
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      });
      const { token } = result.data.signup;
      this._saveUserData(token);
    }
    this.props.history.push(`/`);
  }

  _saveUserData = (token: string) => {
    localStorage.setItem(AUTH_TOKEN, token);
  }
}

export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login);
