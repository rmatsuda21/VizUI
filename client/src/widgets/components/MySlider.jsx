import React from "react";
import "../stylesheets/MySlider.css";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useState } from "react";

import { useContext } from "react";
import WidgetContext from "../contexts/WidgetContext";

function MySlider(props) {
  
    const {widgetVal, socket, appId} = useContext(WidgetContext);
    const [value, setValue] = useState(props.position);

    let sliderStyle = {
        margin: "10px 5px 0px 5px",
    };

    function handleOnChange(e) {
        // console.log(e.target.value)
        setValue(e.target.value);
    }

    function handleOnChangeCommitted() {
        const slider = {appId: appId, data: value, name: props.name}
        console.log(slider)
        socket.emit("widget", slider);
    }

//     async function handleOnChangeCommitted() {
//       socket.emit("updateSliderValue", value);
//       console.log("socket emit: updated slider val to ", value)
//   }

    return (
        <>
            {/* props.geometry contains props.geometry.x, y, width, and height */}
            {/* style = {{position: "absolute", left: props.geometry.x, top: props.geometry.y}} */}
            <Box id="wrapper">
                <Typography
                    variant="h6"
                    sx={{ textAlign: "center" }}
                >
                    {props.name} {value}
                </Typography>
                <Slider
                    aria-label={props.name}
                    style={sliderStyle}
                    min={props.min}
                    max={props.max}
                    orientation={props.orientation}
                    defaultValue={widgetVal[props.name] ? widgetVal[props.name] : 50}
                    step={props.interval}
                    valueLabelDisplay="auto"
                    marks={props.marks}
                    onChange={handleOnChange}
                    onChangeCommitted={handleOnChangeCommitted}
                    sx={{
                        "& .MuiSlider-track": {
                            border: "none",
                        },
                        "& .MuiSlider-thumb": {
                            height: 24,
                            width: 24,
                            backgroundColor: "primary.light",
                            border: "2px solid currentColor",
                            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
                                {
                                    boxShadow: "inherit",
                                },
                            "&:before": {
                                display: "none",
                            },
                        },
                        "& .MuiSlider-valueLabel": {
                            lineHeight: 1.2,
                            fontSize: 12,
                            background: "unset",
                            padding: 0,
                            width: 32,
                            height: 32,
                            borderRadius: "50% 50% 50% 0",
                            backgroundColor: "primary.light",
                            transformOrigin: "bottom left",
                            transform:
                                "translate(50%, -100%) rotate(-45deg) scale(0)",
                            "&:before": { display: "none" },
                            "&.MuiSlider-valueLabelOpen": {
                                transform:
                                    "translate(50%, -100%) rotate(-45deg) scale(1)",
                            },
                            "& > *": {
                                transform: "rotate(45deg)",
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
}

export default MySlider;
