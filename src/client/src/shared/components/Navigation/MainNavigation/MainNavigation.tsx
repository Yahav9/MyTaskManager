import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './MainNavigation.scss';
import MainHeader from '../MainHeader/MainHeader';
import NavLinks from '../NavLinks/NavLinks';
import SideDrawer from '../SideDrawer/SideDrawer';
import Backdrop from '../Backdrop/Backdrop';

function MainNavigation() {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    return (
        <>
            {drawerIsOpen && <Backdrop onClick={() => setDrawerIsOpen(false)} />}
            <SideDrawer show={drawerIsOpen} onClick={() => setDrawerIsOpen(false)}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button
                    className="main-navigation__menu-btn"
                    onClick={() => setDrawerIsOpen(true)}
                >
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/" >MyTaskManager</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    );
}

export default MainNavigation;
