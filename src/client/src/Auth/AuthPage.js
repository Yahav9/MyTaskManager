import React, { useContext, useState } from 'react';
import axios from 'axios';

import './AuthPage.scss';
import Card from '../shared/components/Card/Card';
import Button from '../shared/components/Button/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';
import { AuthContext } from '../shared/context/AuthContext';

function AuthPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);
    const auth = useContext(AuthContext);

    const switchModeHandler = () => {
        setIsLoginMode(!isLoginMode);
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        setIncorrectCredentials(false);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        let mode = '';
        isLoginMode && (mode = 'login');
        !isLoginMode && (mode = 'signup');

        try {
            setIsLoading(true);
            const res = await axios.post(`https://my-awesome-task-manager.herokuapp.com/api/users/${mode}`,
                {
                    name: username,
                    password
                });
            if (res.data.message) {
                setIncorrectCredentials(true);
            } else {
                auth.login(res.data.userId, res.data.token);
            }
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    };

    return (
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h1>{isLoginMode ? 'Login Required' : 'Sign Up'}</h1>
            <form onSubmit={authSubmitHandler}>
                <input
                    type="text"
                    value={username}
                    placeholder="Username"
                    onChange={event => setUsername(event.target.value)}
                />
                <input
                    type="password"
                    value={password}
                    placeholder={isLoginMode ? 'Password' : 'Password (at least 5 characters)'}
                    onChange={event => setPassword(event.target.value)}
                />
                {
                    !isLoginMode &&
                    <input
                        type="password"
                        value={passwordConfirmation}
                        placeholder="Confirm password"
                        onChange={event => setPasswordConfirmation(event.target.value)}
                    />
                }
                {
                    incorrectCredentials &&
                    <p>
                        {
                            isLoginMode ?
                                "Oops! Either the username or the password you've entered is incorrect." :
                                'Sorry, this username is already in use.'
                        }
                    </p>
                }
                <Button
                    disabled={
                        (isLoginMode &&
                            (username.length < 1 || password.length < 1)) ||
                        (!isLoginMode &&
                            (username.length < 1 || password.length < 5 || password !== passwordConfirmation))
                    }
                    type="submit"
                >{isLoginMode ? 'LOGIN' : 'SIGN UP'}</Button>
            </form>
            <span />
            <p>
                {isLoginMode ? "Still don't have a user?" : 'Already have a user?'}
            </p>
            <Button onClick={switchModeHandler} inverse>
                {isLoginMode ? 'SIGN UP!' : 'LOGIN!'}
            </Button>
        </Card>
    );
}

export default AuthPage;
