import React, { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import LoadingSpinner from './shared/components/LoadingSpinner/LoadingSpinner';
import MainNavigation from './shared/components/Navigation/MainNavigation/MainNavigation';
import { AuthContext } from './shared/context/AuthContext';
const AuthPage = lazy(() => import('./Auth/AuthPage'));
const TasksPage = lazy(() => import('./Tasks/TasksPage'));
const ListsPage = lazy(() => import('./Lists/ListsPage'));

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
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');

    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
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
                    element={<AuthPage />}
                />
                <Route
                    path="/:userId/:listid"
                    element={<AuthPage />}
                />
            </Routes>
        );
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
        );

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
                <MainNavigation />
                <main>
                    <Suspense fallback={
                        <div className="center">
                            <LoadingSpinner />
                        </div>
                    }>
                        {routes}
                    </Suspense>
                </main>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
