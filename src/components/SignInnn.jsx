import React, { useState } from "react";

function SignIn() {
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
                body: JSON.stringify({ username, email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Signed up successfully:', data);
                window.location.href = '/login';
            } else {
                console.error('Signup failed');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div class="container mt-5 loginpage">
            <h1>Register</h1>

            <div class="row">
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
            </div>
        </div>
    );
}

export default SignIn;