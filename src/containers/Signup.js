import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      name: ""
    };

  }

  validateForm() {
    return (
      this.state.email.length > 0 && 
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
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
    this.setState({ isError: false });

    try {
      const attributes = {
        'name': this.state.name
      }
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
        attributes
      });
      this.props.history.push({
        pathname: '/login', 
        data: {
          'successMessage': 'Form has been submitted successfully! Please check your inbox for verification link.'
        }
      });
    } catch (err) {
      this.setState({ ErrorMessage: err.message });
      this.setState({ isError: true });
    }
    this.setState({ isLoading: false });
  };

  showError = (message: string) =>  {
    return (
      <div className="alert alert-danger">
        <strong>Error!</strong> {message}
      </div>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="name" bsSize="large">
          <ControlLabel>Name</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </FormGroup>
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        {this.state.isError ? this.showError(this.state.ErrorMessage) : ''}
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…"
        />
        <br/>
        <div>
          <center>Already have an account? <Link to="/login">Sign In</Link></center>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.renderForm()}
      </div>
    );
  }
}
