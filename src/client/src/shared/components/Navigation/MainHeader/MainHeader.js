import React from 'react';

import styles from './MainHeader.module.scss';

function MainHeader(props) {
    return <header className={styles.main_header}>{props.children}</header>;
};

export default MainHeader;
