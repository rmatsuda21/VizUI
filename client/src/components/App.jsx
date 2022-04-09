import Home from "../components/Home";
import View from "../components/View";
import Edit from "../components/Edit";

import { Route, Routes, useRoutes, BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useEffect } from "react";

import { SnackbarProvider } from 'notistack';


const theme = createTheme({
    palette: {
        type: "dark",
        primary: {
            main: "#3f51b5",
            light: "#6574c3",
        },
        secondary: {
            main: "#ff0080",
        },
        background: {
            default: "#0a1929",
            paper: "#102841",
        },
        button: {
            default: "#6D7DDF",
        }
    },
    typography: {
        fontFamily: "LeagueSpartan",
        h1: {
            fontWeight: 1000,
            fontSize: "5rem",
        },
        button: {
            fontWeight: 800,
        },
        h2: {
            fontWeight: 800,
            fontSize: "3.7rem",
        },
        h3: {
            fontSize: "2.5rem",
            fontWeight: 700,
        },
        h4: {
            fontSize: "2rem",
            fontWeight: 600,
        },
    },
});

function App() {
    const [apps, setApps] = useState([]);

    console.log(apps)

    const deleteApp = (filename) => {
        const newApps = apps.filter(app => {
            return app.data.filename !== filename
        })

        setApps(newApps);
    }

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 100));
        await fetch(
            "http://localhost:3001/api/db/query/applications/applications"
        )
            .then((data) => data.json())
            .then((data) => {
                if (!data.data) {
                    setApps([])
                    return;
                }

                setApps(data.data);
                console.log(data.data);
            })
            .catch((e) => {
                console.log(e)
                setApps([])
            });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={5}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home apps={apps} deleteApp={deleteApp}/>}
                    />
                    <Route
                        exact
                        path="/view/:id"
                        element={<View apps={apps} />}
                    />
                    <Route
                        exact
                        path="/edit/:id"
                        element={<Edit apps={apps} />}
                    />
                </Routes>
            </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
