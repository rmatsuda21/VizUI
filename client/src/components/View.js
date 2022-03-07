import "../stylesheets/view.css";
import React from "react";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AppView from "./AppView";

import apis from "../api";
import { CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";

const { Component } = require("react");

import JSConfetti from "js-confetti";
const confetticanvas = new JSConfetti();

const theme = createTheme();
theme.typography = {
    fontFamily: "LeagueSpartan",
    h1: {
        fontWeight: 1000,
        fontSize: "3.5em",
    },
    button: { fontWeight: 800 },
};

function View(props) {
    const { id } = useParams();

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ color: "white" }}>
                    <Typography
                        variant="h2"
                        sx={{ textAlign: "center", marginBlock: "1em" }}
                    >
                        Preview
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1em",
                            alignItems: "center",
                            justifyContent: "space-around",
                            backgroundColor: "#102841",
                            width: '75%', 
                            marginInline: 'auto',
                            padding: '3em',
                        }}
                    >
                        <AppView id={id} confetti={confetticanvas} />
                    </Box>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default View;
