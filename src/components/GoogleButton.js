import React, { Component } from "react";
import { Auth } from "aws-amplify";
import LoaderButton from "./LoaderButton";
import { Helmet } from 'react-helmet';

function waitForInit() {
  return new Promise((res, rej) => {
    const hasGoogleLoaded = () => {
      if (window.Google) {
        res();
      } else {
        setTimeout(hasGoogleLoaded, 300);
      }
    };
    hasGoogleLoaded();
  });
}

export default class GoogleButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  statusChangeCallback = response => {
    if (response.status === "connected") {
      this.handleResponse(response.authResponse);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = () => {
    window.Google.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    window.Google.login(this.checkLoginState, {scope: "public_profile,email"});
  };

  handleError(error) {
    alert(error);
  }

  async handleResponse(data) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    this.setState({ isLoading: true });

    try {
      const response = await Auth.federatedSignIn(
        "google",
        { token, expires_at },
        user
      );
      this.setState({ isLoading: false });
      this.props.onLogin(response);
    } catch (e) {
      this.setState({ isLoading: false });
      this.handleError(e);
    }
  }

  render() {
    return (
      <LoaderButton
        block
        bsSize="large"
        bsStyle="primary"
        className="FacebookButton"
        text="Login with Google"
        onClick={this.handleClick}
      />
    );
  }
}
