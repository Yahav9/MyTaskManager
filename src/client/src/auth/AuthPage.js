import React, { useState } from "react";

function AuthPage() {

    const [mode, setMode] = useState('login');

    const changeToSignup = () => setMode('signup')
    const changeToLogin = () => setMode('login')

    const LOGIN = (
        <div>
            <h1>Login Required</h1>
            <form>
                <label>Username: </label>
                <input type="text" />
                <label>Password: </label>
                <input type="password" />
                <button>LOGIN</button>
            </form>
            <p>Still don't have a user?</p>
            <button onClick={changeToSignup}>SIGN UP!</button>
        </div>
    )

    const SIGNUP = (
        <div>
            <h1>Sign Up</h1>
            <form>
                <label>Username: </label>
                <input type="text" />
                <label>Password: </label>
                <input type="password" />
                <label>Confirm Password: </label>
                <input type="password" />
                <button>SIGNUP</button>
            </form>
            <p>Already have a user?</p>
            <button onClick={changeToLogin}>LOGIN!</button>
        </div>
    )

    if (mode === 'login') {
        return LOGIN;
    }
    if (mode === 'signup') {
        return SIGNUP;
    }
}

export default AuthPage;