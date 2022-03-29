import logo from "./logo.svg";
import React from "react";
import "./App.css";

const { io } = require("socket.io-client");
const ENDPOINT = "http://localhost:3001";

function App() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("http://localhost:3001/")
            .then((res) => res.json())
            .then((data) => setData(data[0].name));

        const socket = io();
        socket.on("TEST", () => {
            console.log("GOT TEST");
        });
        return () => socket.disconnect();
    }, []);

    const testSocket = () => {
        fetch("http://localhost:3001/test");
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>{data}</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button onClick={testSocket}>TEST SOCKET</button>
            </header>
        </div>
    );
}

export default App;
