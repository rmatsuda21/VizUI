import React, { useState } from "react";
import "../stylesheets/MyDialKnob.css";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { HighContrast } from "react-dial-knob";
import { useTheme } from "@mui/styles";
import socketInstace from "../../js/SocketProvider";

const socket = socketInstace;
import { useContext } from "react";
import WidgetContext from "../contexts/WidgetContext";

function MyDialKnob(props) {
    const {widgetVal, socket, appId} = useContext(WidgetContext);

    const [value, setValue] = useState(widgetVal[props.name] ? widgetVal[props.name] : 0);
    const [count, setCount] = React.useState(0);

    const theme = useTheme();

    const countUpdate = () => {
        // if count is 1: mouseDown
        //if count is 0: mouseUp
        if (count == 1) {
            setCount(count - 1);
            // widgetVal[props.name] = value;
            handleOnChangeCommitted();
        } else {
            setCount(count + 1);
        }
    };

    function handleOnChangeCommitted() {
        const dial = {appId: appId, data: value, name: props.name}
        console.log("client side emit: ", dial)
        socket.emit("widget", dial);
    }

    // async function onSubmit() {
    //     socket.emit("updateDialValue", value);
    //     console.log("socket emit: updated Dial val to ", value)
    // }

    return (
        <>
            {/* props.geometry contains props.geometry.x, y, width, and height */}
            <Box id="wrapper">
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                >
                    {props.name}
                </Typography>
                <HighContrast
                    diameter={200}
                    min={props.min}
                    max={props.max}
                    step={1}
                    value={value}
                    theme={{
                        defaultColor: theme.palette.primary.main,
                        activeColor: theme.palette.primary.light,
                    }}
                    style={{
                        ...props.sx,
                        position: "relative",
                    }}
                    onValueChange={setValue}
                    onInteractionChange={() => {
                        countUpdate();
                    }}
                    // value={widgetVal[props.name] ? widgetVal[props.name] : value}

                >
                    <Typography variant="p">
                        {/* MouseEvent:{count}
                        <br />
                        Value:{value} */}
                    </Typography>
                </HighContrast>
            </Box>
        </>
    );
}

export default MyDialKnob;
