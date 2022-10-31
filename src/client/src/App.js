import React, { useCallback, useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AuthPage from './Auth/AuthPage';
import TasksPage from './Tasks/TasksPage';
import ListsPage from './Lists/ListsPage';
import { AuthContext } from "./shared/context/AuthContext";

let logoutTimer;

function App() {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(false);

    const login = useCallback((userId, token, expirationDate) => {
        setToken(token);
        setUserId(userId);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: userId,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })

        );
        console.log(token)
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');

    }, [])

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        };
    }, [login]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            console.log(remainingTime / 60 / 1000)
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    let routes;
    if (!token) {
        routes = (
            <Routes>
                <Route
                    exact
                    path="/auth"
                    element={<AuthPage />}
                />
                <Route
                    path="/"
                    element={<Navigate to="/auth" />}
                />
                <Route
                    path="/:userId"
                    element={<Navigate to="/auth" />}
                />
            </Routes>
        )
    } else {
        routes = (
            <Routes>
                <Route
                    path={`/${userId}`}
                    element={<ListsPage />}
                />
                <Route
                    path={`/${userId}/:listId`}
                    element={<TasksPage />}
                />
                <Route
                    exact
                    path="/"
                    element={<Navigate to={`/${userId}`} />}
                />
                <Route
                    exact
                    path="/auth"
                    element={<Navigate to={`/${userId}`} />}
                />
            </Routes>
        )

    }


    return (
        <AuthContext.Provider
            value={{
                userId: userId,
                token: token,
                login: login,
                logout: logout
            }}
        >
            <BrowserRouter>
                <main>{routes}</main>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App;