import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
   
    this.setState({ isLoading: false });
  }

  renderNotes() {
    return (
      <div className="notes">
        <h1>Amplify Cognito App</h1>
        <p>Signed in Successfully!</p>
        <p>Welcome {this.props.user.name}</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : ''}
      </div>
    );
  }
}
