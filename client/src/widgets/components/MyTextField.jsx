import React, { useState, useContext } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import CssTextField from "../../mui-styled/CssTextField";
import WidgetContext from "../contexts/WidgetContext";
import socket from "../contexts/SocketProvider";

function MyTextField(props) {
    const { widgetVal, appId } = useContext(WidgetContext);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <CssTextField
                id="app-name"
                name="appName"
                label={props.label}
                autoComplete="off"
                placeholder={props.placeholder}
                defaultValue={
                    widgetVal
                        ? widgetVal[props.label]
                            ? widgetVal[props.label]
                            : ""
                        : ""
                }
                disabled={props.disabled}
                onChange={(event) => {
                    const textField = {
                        appId: appId,
                        data: event.target.value,
                        name: props.label,
                    };
                    socket.emit("widget", textField);
                }}
            />
        </Box>
    );
}

export default MyTextField;
