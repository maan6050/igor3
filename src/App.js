import React, { Component, Fragment, useEffect } from "react";
import Amplify, { Auth, Hub } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
// import config from "./config";
import { validateToken } from './Utils/helper';
import { AUTH_USER_TOKEN_KEY, AUTH_USER_KEY } from './Utils/constants';
import "./App.css";
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      user: null, 
      customState: null,
      isRegistered: false,
      loginLoading: false
    };
  }

  async componentDidMount() {
   
    if (validateToken()) {
      console.log('Token Valid');
      this.userHasAuthenticated(true);
      if (!this.state.user) {
        this.setState({ user: JSON.parse(localStorage.getItem(AUTH_USER_KEY)) });
      }
    } else {
      console.log('testing');
      Auth.currentAuthenticatedUser({
        bypassCache: false
      })
      .then(user  =>  {
        console.log(user);
        const accessToken = user.signInUserSession.accessToken.jwtToken;
        console.log(accessToken);
        const userData = {
          name: user.signInUserSession.idToken.payload.name,
          sub: user.signInUserSession.idToken.payload.sub,
          email: user.signInUserSession.idToken.payload.email,
          email_verified: user.signInUserSession.idToken.payload.email_verified,
          phone_number: user.signInUserSession.idToken.payload.phone_number,
          phone_number_verified: user.signInUserSession.idToken.payload.phone_number_verified,
        }
        console.log(userData);
        this.setUserData(userData);
        localStorage.setItem(AUTH_USER_TOKEN_KEY, accessToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        this.userHasAuthenticated(true);
      })
      .catch(err =>  console.log(err));
    }

    this.setState({ isAuthenticating: false });
  };

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  setUserData = data => {
    this.setState({ user: data });
  }
  
  setRegistered = registered => {
    console.log('isRegistered:'+registered);
    this.setState({ isRegistered: registered });
  }
  
  handleLogout = async event => {
    console.log('handleLogout');
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.setState({ user: null });
    localStorage.removeItem(AUTH_USER_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this.props.history.push('/login');
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      user: this.state.user,
      setUserData: this.setUserData,
      isRegistered: this.isRegistered,
      setRegistered: this.setRegistered
    };
    /*
    <LinkContainer to="/signup">
                          <NavItem>Signup</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/login">
                          <NavItem>Login</NavItem>
                        </LinkContainer>
    */
    return (
      !this.state.isAuthenticating && (
        <div className="App container">
          {this.state.loginLoading ? (
            <div>Please wait, Loggin you in...</div>
          ) : (
            <div>
              <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to="/">Amplify Cognito App</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav pullRight>
                    {this.state.isAuthenticated ? (
                      <NavItem onClick={this.handleLogout}>Logout</NavItem>
                    ) : (
                      <Fragment>
                        
                      </Fragment>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <Routes childProps={childProps} />
            </div>
          )}
        </div>
      )
    );
  }
}

export default withRouter(App);
