import React, { useState } from "react";
import "../stylesheets/MyDialKnob.css";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { HighContrast } from "react-dial-knob";
import { useTheme } from "@mui/styles";


function MyDialKnob(props) {
    const [value, setValue] = useState(0);
    const [count, setCount] = React.useState(0);

    const theme = useTheme();

    const socket = io();

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
        console.log("socket emit: updated Dial val to ", value)
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
                        defaultColor: theme.palette.primary.dark,
                        activeColor: theme.palette.primary.main,
                    }}
                    style={{
                        position: "relative",
                        margin: "100px auto",
                        width: "200px",
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
