import * as React from "react";
import { Route, Routes } from "react-router-dom";
const { io } = require("socket.io-client");

import Home from "../components/Home";
import View from "../components/View";

export function App() {

    const socket = io();

    return (
        <Routes>
            <Route exact path="/" element={<Home socket={socket}/>} />
            <Route exact path="/view/:id" element={<View />} />
        </Routes>
    );
}

// export default App;
