import React, { useState } from "react";
import {  Typography } from "@mui/material";
import { Box } from "@mui/system";
import CssTextField from "../../mui-styled/CssTextField";

function MyTextField(props) {

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <CssTextField
                id="app-name"
                name="appName"
                label={props.label}
                autoComplete="off"
                placeholder={props.placeholder}
                disabled={props.disabled}
                // onChange={}
            />
        </Box>
    );
}

export default MyTextField;
