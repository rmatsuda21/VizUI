import React, { useContext, useEffect } from "react";
import { Radio } from "@mui/material";
import { Box } from "@mui/system";
import { RadioContext } from "../contexts/RadioContext";
import connectToContext from "../contexts/ConnectContext";
import WidgetContext from "../contexts/WidgetContext";
import socket from "../contexts/SocketProvider";

// use memo so it reloads on prop or context change
const MyRadio = React.memo(({ props, values, setValues }) => {

    const {widgetVal, appId} = useContext(WidgetContext);

    useEffect(() => {
        
        if (widgetVal[props.group]) {
            const defaultVal = {}
            defaultVal[props.group] =  widgetVal[props.group]
            setValues(defaultVal)
        }
        
    }, []);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <Radio
                sx={{
                    ...props.sx,
                }}
                checked={values[props.group] === props.name}
                onChange={event => {
                    
                    let newValues = Object.assign({}, values);
                    newValues[props.group] = event.target.value;
                    setValues(newValues);

                    const radio = {appId: appId, data: event.target.value, name: props.group}
                    socket.emit("widget", radio);
                }}
                value={props.name}
                id={props.name}
                name={props.group}
                inputProps={{ "aria-label": props.name }}
            />
            <label htmlFor={props.name}>{props.label}</label>
        </Box>
    );
});

// return radio context parameters
function select() {
    const { values, setValues } = useContext(RadioContext);
    return {
        values: values,
        setValues: setValues,
    };
}

// use to pass context and props to MyRadio
export default connectToContext(MyRadio, select);
