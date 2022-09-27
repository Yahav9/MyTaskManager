import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from './App';
import AuthPage from './auth/AuthPage';
import ListPage from './list/ListPage';
import ListsPage from './lists/ListsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="auth" element={<AuthPage />} />
        <Route path=":username" element={<ListsPage />} />
        <Route path=":username/:list" element={<ListPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
