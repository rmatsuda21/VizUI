import React, { useState } from "react";
import "../stylesheets/MySlider.css";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function MySlider(props) {
    var [value, setValue] = useState(0);
    let sliderStyle = {
        width: "200px",
        margin: "10px 5px 0px 5px",
    };

    const valueUpdate = (position) => {
        setValue(value = position);
    };

    function PostRequest() {
        fetch("/clicked", { method: "POST" })
            .then(function (response) {
                if (response.ok) {
                    console.log("Slider was changed");
                    return;
                }
                throw new Error("Slider request failed.");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            {/* props.geometry contains props.geometry.x, y, width, and height */}
            <Box id="wrapper">
                <Typography variant="h3" gutterBottom sx={{textAlign: 'center'}}>{props.name}</Typography>
                <Slider
                    defaultValue={props.position}
                    step={props.interval}
                    min={props.min}
                    max={props.max}
                    style={sliderStyle}
                    valueLabelDisplay="on"
                    sx={{
                        "& .MuiSlider-thumb": {
                            height: 24,
                            width: 24,
                            backgroundColor: "#fff",
                            border: "2px solid currentColor",
                            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible":
                                {
                                    boxShadow: "inherit",
                                },
                        },
                        // slider value
                        "& .MuiSlider-valueLabel": {
                            top: 55, // negative = up, positive = down
                            backgroundColor: "unset",
                            color: "white",
                            fontWeight: 800,
                            "&:before": {
                                display: "none",
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
}

export default MySlider;
