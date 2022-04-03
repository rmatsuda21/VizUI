import Home from "../components/Home";
import View from "../components/View";

import * as React from "react";
import { Route, Routes, useRoutes, BrowserRouter } from "react-router-dom";

function App() {
    

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/view/:id" element={<View />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;