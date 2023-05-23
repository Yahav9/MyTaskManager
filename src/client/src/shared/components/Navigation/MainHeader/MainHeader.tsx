import React from 'react';

import './MainHeader.scss';

function MainHeader(props) {
    return <header className="main_header">{props.children}</header>;
}

export default MainHeader;
