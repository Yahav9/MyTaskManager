import React from "react";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <nav>Navigation</nav>
            <Outlet />
        </>
    )
}

export default App;