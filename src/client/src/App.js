import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import AuthPage from './Auth/AuthPage';
import TasksPage from './Tasks/TasksPage';
import ListsPage from './lists/ListsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/:userId" element={<ListsPage />} />
                <Route path="/:userId/:listId" element={<TasksPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;