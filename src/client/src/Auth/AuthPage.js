import React, { useContext, useState } from "react";
import axios from 'axios';

import Card from "../shared/components/Card/Card";
import Button from "../shared/components/Button/Button";
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner'
import { AuthContext } from "../shared/context/AuthContext";

function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const auth = useContext(AuthContext);

    const switchModeHandler = () => {
        setIsLoginMode(!isLoginMode);
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
    }

    const authSubmitHandler = async event => {
        event.preventDefault();

        let mode = '';
        isLoginMode && (mode = 'login');
        !isLoginMode && (mode = 'signup');

        try {
            setIsLoading(true);
            const res = await axios.post(`http://localhost:4000/api/users/${mode}`, { name: username, password });
            console.log(res.data);
            setIsLoading(false);
            auth.login(res.data.userId, res.data.token);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    }

    return (
        <Card>
            {isLoading && <LoadingSpinner asOverlay />}
            <h1>{isLoginMode ? 'Login Required' : 'Sign Up'}</h1>
            <form onSubmit={authSubmitHandler}>
                <label>Username: </label>
                <input
                    type="text"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
                <label>Password{!isLoginMode && ' (at least 5 characters)'}: </label>
                <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
                {
                    !isLoginMode &&
                    <>
                        <label>Confirm Password: </label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={event => setPasswordConfirmation(event.target.value)}
                        />
                    </>
                }
                <Button
                    disabled={
                        (isLoginMode && (username.length < 1 || password.length < 1)) ||
                        (!isLoginMode && (username.length < 1 || password.length < 5 || password !== passwordConfirmation))
                    }
                    type="submit"
                >{isLoginMode ? 'LOGIN' : 'SIGN UP'}</Button>
            </form>
            <p>
                {isLoginMode ? "Still don't have a user?" : 'Already have a user?'}
            </p>
            <Button onClick={switchModeHandler}>
                {isLoginMode ? 'SIGN UP!' : 'LOGIN!'}
            </Button>
        </Card>
    )
}

export default AuthPage;