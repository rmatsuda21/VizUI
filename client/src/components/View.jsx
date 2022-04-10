// import "../stylesheets/view.css";
import JSConfetti from "js-confetti";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AppView from "./AppView";

import apis from "../js/api";
import { CssBaseline, Typography } from "@mui/material";
import { Box } from "@mui/system";

const { Component } = require("react");

const confetticanvas = new JSConfetti();

function View(props) {
    const { id } = useParams();
    const [appName, setAppName] = useState("");

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 350));
        props.apps.forEach((data) => {
            if (data.data.filename === id) {
                setAppName(data.data.name);
                return;
            }
        });
    });

    return (
        <Box sx={{ color: "white" }}>
            <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBlock: "1em" }}
            >
                {appName}
            </Typography>
            <Box
                sx={{
                    // backgroundColor: "#102841",
                    width: "75%",
                    marginInline: "auto",
                    // padding: "3em",
                }}
            >
                <AppView id={id} confetti={confetticanvas} />
            </Box>
        </Box>
    );
}

export default View;
