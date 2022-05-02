import React from "react";
import ReactDOM from "react-dom";

it("renders without errors", () => {
    const div = document.createElement("div");
    ReactDOM.render(<AppView id={0} />, div);
});
