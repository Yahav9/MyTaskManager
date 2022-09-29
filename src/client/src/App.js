import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import AuthPage from './auth/AuthPage';
import EditTask from './EditTask/EditTask';
import ListPage from './list/ListPage';
import ListsPage from './lists/ListsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path=":username" element={<ListsPage />} />
                <Route path=":username/:list" element={<ListPage />} />
                <Route path='/:username/:list/edit-task' element={<EditTask />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;