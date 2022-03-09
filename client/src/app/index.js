import Home from "../components/Home";
import View from "../components/View";

import * as React from "react";
import { Route, Routes, useRoutes, BrowserRouter } from "react-router-dom";
const { io } = require("socket.io-client");

export function App() {

    const socket = io();

    const App = () => {
        let routes = useRoutes([
          { path: "/", element: <Home socket={socket}/> },
          { path: "/view/:id", element: <View/> },
        ]);
        return routes;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home socket={socket}/>} />
                <Route exact path="/view/:id" element={<View />} />
            </Routes>
        </BrowserRouter>
    );
}

// export default App;
