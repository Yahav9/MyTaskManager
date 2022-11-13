import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import './NavLinks.scss';

function NavLinks() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        auth.logout();
        navigate('/auth');
    }

    return (
        <ul className="nav-links">
            {auth.token && (
                <li>
                    <NavLink to={`/${auth.userId}`}>MY LISTS</NavLink>
                </li>
            )}
            {!auth.token && (
                <li>
                    <NavLink to="/auth">LOGIN</NavLink>
                </li>
            )}
            {auth.token && (
                <li>
                    <button onClick={logoutHandler}>
                        LOGOUT
                    </button>
                </li>
            )}
        </ul>
    )

}

export default NavLinks;