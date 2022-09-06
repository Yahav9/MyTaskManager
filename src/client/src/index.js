import ReactDOM from 'react-dom/client';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import App from './App';
import SignUp from './routes/SignUp/SignUp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/*" element={<div>hello world</div>} />
        </Routes>
    </BrowserRouter>
);
