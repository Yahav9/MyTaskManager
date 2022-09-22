import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from './App';
import Auth from './auth/pages/Auth';
import List from './list/pages/List';
import Lists from './lists/pages/Lists';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="auth" element={<Auth />} />
        <Route path=":username" element={<Lists />} />
        <Route path=":username/:list" element={<List />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
