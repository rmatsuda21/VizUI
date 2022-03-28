import React from "react";
import "../stylesheets/MyDial.css";
import CircularSlider from '@fseehawer/react-circular-slider';
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function MyDial(props) {
    let sliderStyle = {
        width: "200px",
        margin: "10px 5px 0px 5px",
    };

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
                <CircularSlider
                    // defaultValue={props.position}
                    label={props.name}
                    min={props.min}
                    max={props.max}
                />
            </Box>
        </>
    );
}

export default MyDial;
