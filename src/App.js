import React, { Component, Fragment } from "react";
import { Auth, Hub } from "aws-amplify";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
// import config from "./config";
import { validateToken } from './Utils/helper';
import { AUTH_USER_TOKEN_KEY, AUTH_USER_KEY } from './Utils/constants';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      user: null, 
      customState: null,
      isRegistered: false
    };
  }

  async componentDidMount() {

    // Hub.listen("auth", ({ payload: { event, data } }) => {
    //   console.log('Hub Switch');
    //   console.log(event);
    //   switch (event) {
    //     // case "signIn":
    //     //   console.log(data);
    //     //   console.log(data['CognitoUser:signInUserSession']);
    //     //   console.log(data['CognitoUser:username']);
    //     //   console.log(data['username']);
    //     //   console.log(data.username);
    //     //   // localStorage.setItem(AUTH_USER_TOKEN_KEY, data.signInUserSession.accessToken.jwtToken);
    //     //   let userData = {};
    //     //   if (data.attributes) {
    //     //     userData = data.attributes;
    //     //   } else {

    //     //   }
    //     //   console.log(userData);
    //     //   this.setState({ user: userData });
    //     //   localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    //     //   this.userHasAuthenticated(true);
    //     //   break;
    //     case "signOut":
    //       this.userHasAuthenticated(false);
    //       localStorage.removeItem(AUTH_USER_TOKEN_KEY);
    //       localStorage.removeItem(AUTH_USER_KEY);
    //       this.setState({ user: null });
    //       this.props.history.push("/login");
    //       break;
    //     case "customOAuthState":
    //       this.setState({ customState: data });
    //       break;
    //     default:
    //       console.log('default');
    //       this.userHasAuthenticated(false);

    //   }
    // });

    // if (validateToken()) {
    //   console.log('Token Valid');
    //   this.userHasAuthenticated(true);
    //   if (!this.state.user) {
    //     this.setState({ user: JSON.parse(localStorage.getItem(AUTH_USER_KEY)) });
    //   }
    // } else {
      try {
        let data = await Auth.currentAuthenticatedUser();
        console.log(data);
        let userData = data.attributes ? data.attributes : {};
        this.setUserData(userData);
        this.userHasAuthenticated(true);
      } catch (e) {
        if (e !== "not authenticated") {
          alert(e);
        }
      }

    // } /*   Validate token else end */    

    this.setState({ isAuthenticating: false });
  }

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
      )
    );
  }
}

export default withRouter(App);
