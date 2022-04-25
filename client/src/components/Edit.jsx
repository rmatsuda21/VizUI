// import "../stylesheets/view.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import apis from "../js/api";
import { Button, CssBaseline, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { EditView } from "./EditView";

const { Component } = require("react");

function View(props) {
    const { id } = useParams();
    const [appName, setAppName] = useState("");

    useEffect(() => {
        props.apps.forEach((data) => {
            if (data.data.filename === id) {
                setAppName(data.data.name);
                return;
            }
        });
    });

    return (
        <Box sx={{ color: "white" }}>
            <IconButton
                sx={{position: "fixed", margin: "0 0 0 30px", left: "0"}}
                href="/">
                <ArrowBackIcon></ArrowBackIcon>
            </IconButton>
            
            <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBlock: "1em" }}
            >
                Editing {appName}
            </Typography>
            {/* <Button variant="contained" sx={{height:'2rem'}}>HERE</Button> */}
            <Box
                sx={{
                    // backgroundColor: "#102841",
                    width: "75%",
                    marginInline: "auto",
                    // padding: "3em",
                }}
            >
                <EditView id={id} confetti={null} />
            </Box>
        </Box>
    );
}

export default View;
