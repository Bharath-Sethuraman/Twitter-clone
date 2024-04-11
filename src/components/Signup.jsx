import React, { useState } from "react";

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Signed up successfully:', data);
                window.location.href = '/login';
            } else {
                console.error('Signup failed');
                alert("cc");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getVal = () => {
        // Replace with your authentication server's URL
        const authUrl = 'http://localhost:5000/auth/google';

        // Open a new window to the authentication URL
        window.open(authUrl, '_blank');
    };

    return (
        <div class="container mt-5 loginpage ">
            <h1>Register</h1>

            <div class="row justify-content-center">
                <div class="col-sm-8">
                    <div class="card">
                        <div class="card-body">
                            <form action="/">
                                <div class="form-group">
                                    <label for="username">Name</label>
                                    <input type="text" class="form-control" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                                </div>
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" class="form-control" name="username" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                </div>
                                <button type="submit" class="btn btn-dark" onClick={handleSignup}>Register</button>
                            </form>

                        </div>
                    </div>
                </div>

                <div class="col-sm-4">
                    <div class="card social-block">
                        <div class="card-body">
                            <button class="btn btn-block btn-social btn-google" onClick={getVal}>
                                <i class="fab fa-google"></i>
                                Sign Up with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;