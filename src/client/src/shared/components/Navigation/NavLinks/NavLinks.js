import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../context/AuthContext';
import styles from './NavLinks.module.scss';

function NavLinks() {
    const auth = useContext(AuthContext);
    const listId = window.location.pathname.slice(26);
    const navigate = useNavigate();

    const logoutHandler = () => {
        auth.logout();
        navigate('/auth');
        console.log(listId);
    }

    return (
        <ul className={styles.nav_links}>
            {auth.token && listId.length > 0 && (
                <li className={styles.list_item}>
                    <NavLink className={styles.link} to={`/${auth.userId}`}> &lt;= BACK TO MY LISTS</NavLink>
                </li>
            )}
            <li className={styles.list_item}>
                <NavLink className={styles.link} to="/about">ABOUT</NavLink>
            </li>
            {!auth.token && (
                <li className={styles.list_item}>
                    <NavLink className={styles.link} to="/auth">LOGIN</NavLink>
                </li>
            )}
            {auth.token && (
                <li className={styles.list_item}>
                    <button className={styles.logout} onClick={logoutHandler}>
                        LOGOUT
                    </button>
                </li>
            )}
        </ul>
    )

}

export default NavLinks;