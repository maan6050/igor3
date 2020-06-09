import React, { Component } from "react";
import Amplify, { Auth } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import { AUTH_USER_TOKEN_KEY, AUTH_USER_KEY } from '../Utils/constants';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      ErrorMessage: null,
      successMessage: null
    };

    if (this.props.isAuthenticated) this.props.history.push('/');
  }

  async componentDidMount() {
    const { data } = this.props.location;
    if (data && data.successMessage)
      this.setState({ successMessage: data.successMessage });
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
    this.setState({ ErrorMessage: null });
    this.setState({ successMessage: null });

    Auth.signIn(this.state.email, this.state.password)
      .then(user => {
        const accessToken = user.signInUserSession.accessToken.jwtToken;
        const userData = user.attributes ? user.attributes : {};
        this.setState({ successMessage: 'Logged in successfully!!' });
        this.props.setUserData(userData);
        localStorage.setItem(AUTH_USER_TOKEN_KEY, accessToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        this.props.userHasAuthenticated(true);
      })
      .catch(err => {
        this.setState({ ErrorMessage: err.message });
        this.setState({ isLoading: false });
      });
  };

  socialLogin = (provider)  =>  {
    Auth.federatedSignIn({provider: provider});
  }

  showSuccess = () =>  {
    return (
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="alert alert-success">
            <strong>Success!</strong> {this.state.successMessage}
          </div>
        </div>
      </div>
    );
  }

  showError = () =>  {
    return (
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <div className="alert alert-danger">
            <strong>Error!</strong> {this.state.ErrorMessage}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="Login">
        {this.state.successMessage ? this.showSuccess() : ''}
        {this.state.ErrorMessage ? this.showError() : ''}
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <div className="login-title">Sign In with your social account</div>
            <LoaderButton
              block
              bsSize="large"
              type="button"
              text="Continue with Facebook"
              onClick={() => this.socialLogin('Facebook')}
              className="btn-primary facebook"
            />
            <LoaderButton
              block
              bsSize="large"
              type="button"
              text="Continue with Google"
              onClick={() => this.socialLogin('Google')}
              className="btn-primary google"
            />
            <LoaderButton
              block
              bsSize="large"
              type="button"
              text="Continue with LinkedIn"
              onClick={() => this.socialLogin('LinkedIn')}
              className="btn-primary linkedIn"
            />
            <LoaderButton
              block
              bsSize="large"
              type="button"
              text="Continue with Apple"
              onClick={() => this.socialLogin('Apple')}
              className="btn-primary appple"
            />
            <br/>
            <div className="disclaimer">We won't post to any of your accounts without asking first</div>
          </div>
          <div className="col-md-4">
            <form onSubmit={this.handleSubmit}>
              <div className="login-title">Sign in with your email and password</div>
              <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>
              <LoaderButton
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                isLoading={this.state.isLoading}
                text="Sign In"
                loadingText="Signing in…"
                className="btn btn-info"
              />
              <br/>
              <div><center>Need an account? <Link to="/signup">Sign up</Link></center></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
