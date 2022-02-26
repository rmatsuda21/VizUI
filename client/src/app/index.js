import * as React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../components/Home";
import View from "../components/View";

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/view" element={<View />} />
        </Routes>
    );
}

export default App;
