import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';

function Login() {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <div className="login-content">
                <h1>Login</h1>
                <div className="mt-3">
                    <div className="mb-3">
                        <a className="btn btn-block btn-primary btn-social-custom custom-login-btn" role="button" href="http://localhost:5000/auth/google">
                            <i className="fab fa-google"></i>
                            Sign Up with Google
                        </a>
                    </div>
                    <div>
                        <a className="btn btn-block btn-primary btn-social-custom custom-login-btn btn-facebook" role="button" href="http://localhost:5000/auth/facebook">
                            <i className="fab fa-facebook"></i>
                            Sign Up with Facebook
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
