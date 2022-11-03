import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import './NavLinks.scss';

function NavLinks() {
    const auth = useContext(AuthContext);
    const listId = window.location.pathname.slice(26);
    const navigate = useNavigate();

    const logoutHandler = () => {
        auth.logout();
        navigate('/auth');
    }

    return (
        <ul className="nav-links">
            {auth.token && listId.length > 0 && (
                <li>
                    <NavLink to={`/${auth.userId}`}> &lt;= BACK TO MY LISTS</NavLink>
                </li>
            )}
            <li>
                <NavLink to="/about">ABOUT</NavLink>
            </li>
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