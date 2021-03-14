import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import Footer from '../common/Footer';
import { Message, messageType } from '../common/Message';
import '../css/Registration.css';
import settings from '../../settings';
import adapter from '../../utils/adapter'

const initialState = {
    emailAddress: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    emailAddressError: "",
    passwordError: "",
    confirmPasswordError: "",
    nameError: "",
    message: "",
    messageType: ""
};

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const isValid = this.validate();

        if (isValid) {
            const url = `https://api.timkoto.com/${settings.env}api/registration/v1/User`;
            const content = {
                email: this.state.emailAddress,
                userName: this.state.name,
                phoneNumber: this.state.phoneNumber,
                password: this.state.password,
                registrationCode: 'c5132259ddb6491e9f27318340dab795'
            };

            const response = await adapter.Post(url, content);

            if (!response.ok) {
                this.setState({
                    message: "An error occured while trying to register.", //response.status
                    messageType: messageType.danger
                });
            } else {
                this.props.history.push("/registersuccess");
            }
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            [`${e.target.id}Error`]: ""
        });
    }

    validate = () => {        
        let emailAddressError = "";
        let passwordError = "";
        let confirmPasswordError = "";
        let nameError = "";

        if (!this.state.emailAddress) {
            emailAddressError = "Email address cannot be blank.";
        }

        if (this.state.emailAddress && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.emailAddress)) {
            emailAddressError = "Invalid email format."
        }

        if (!this.state.password) {
            passwordError = "Password is required.";
        }

        if (this.state.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i.test(this.state.password)) {
            passwordError = "Password must be at least 8 characters with 1 number and 1 letter.";
        }

        if (!this.state.confirmPassword) {
            confirmPasswordError = "Confirm password is required.";
        }

        if (this.state.confirmPassword && (this.state.password !== this.state.confirmPassword)) {
            confirmPasswordError = "Confirm password does not match the provided password.";
        }

        if (!this.state.name) {
            nameError = "Name is required."
        }

        if (this.state.name && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,30}$/i.test(this.state.name)) {
            nameError = "Name must be at least 2 characters with 1 number and 1 letter.";
        }

        if (emailAddressError || passwordError || confirmPasswordError || nameError) {
            this.setState({ emailAddressError, passwordError, confirmPasswordError, nameError });
            return false;
        }

        return true;
    }

    render() {
        return (
            <div className="container">
                <header>
                    <div className="center-content">
                        <Link to="/">
                            <img src={logo} className="app-logo" alt="logo" />
                        </Link>
                    </div>
                    <div className="center-content">
                        <h3>Register</h3>
                    </div>
                </header>
                <main>
                    <Message text={this.state.message} messageType={this.state.messageType} />
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="emailAddress">Email Address:</label>
                            <input type="text"
                                className="form-control"
                                id="emailAddress"
                                placeholder="Email Address"
                                value={this.state.emailAddress}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.emailAddressError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.passwordError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={this.state.confirmPassword}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.confirmPasswordError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                value={this.state.name}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.nameError}
                            </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input type="tel"
                                className="form-control"
                                id="phoneNumber"
                                placeholder="Phone Number"
                                value={this.state.phoneNumber}
                                onChange={this.onChange} />
                            <span className="text-danger">
                                {this.state.phoneNumberError}
                            </span>
                        </div>
                        <div className="center-content">
                            <input type="submit" value="Submit" className="btn btn-primary" />
                        </div>
                    </form>
                </main>
                <Footer />
            </div>
        );
    }
}

export default Registration;