// import "../stylesheets/view.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import apis from "../js/api";
import { Button, CssBaseline, Typography } from "@mui/material";
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
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBlock: "1em" }}
            >
                EDIT: {appName}
            </Typography>
            {/* <Button variant="contained" sx={{height:'2rem'}}>HERE</Button> */}
            </Box>
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
