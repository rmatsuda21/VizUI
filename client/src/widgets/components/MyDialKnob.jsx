import React, { useState } from "react";
import "../stylesheets/MyDialKnob.css";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { HighContrast } from "react-dial-knob";
import { useTheme } from "@mui/styles";
import socketInstace from "../../js/SocketProvider";

const socket = socketInstace;

function MyDialKnob(props) {
    const [value, setValue] = useState(0);
    const [count, setCount] = React.useState(0);

    const theme = useTheme();

    const countUpdate = () => {
        // if count is 1: mouseDown
        //if count is 0: mouseUp
        if (count == 1) {
            setCount(count - 1);
            onSubmit();
        } else {
            setCount(count + 1);
        }
    };

    async function onSubmit() {
        socket.emit("updateDialValue", value);
    }

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
                >
                    <Typography variant="p">
                        MouseEvent:{count}
                        <br />
                        Value:{value}
                    </Typography>
                </HighContrast>
            </Box>
        </>
    );
}

export default MyDialKnob;
