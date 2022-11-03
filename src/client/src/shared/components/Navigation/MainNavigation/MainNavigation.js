import React from 'react';
import { Link } from 'react-router-dom';

import MainHeader from '../MainHeader/MainHeader';
import NavLinks from '../NavLinks/NavLinks';
import styles from './MainNavigation.module.scss';

function MainNavigation() {

    return (
        <MainHeader>
            <h1 className={styles.main_navigation__title}>
                <Link to="/" className={styles.link}>MyTaskManager</Link>
            </h1>
            <nav className={styles.main_navigation__header_nav}>
                <NavLinks />
            </nav>
        </MainHeader>
    )
}

export default MainNavigation;