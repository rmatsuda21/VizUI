import React from "react";
import "../stylesheets/MySlider.css";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function MySlider(props) {
    let sliderStyle = {
        margin: '10px 5px 0px 5px'
    };
    
    props.orientation == 'horizontal' 
        ? sliderStyle = Object.assign(sliderStyle, {width: props.geometry.width}) 
        : sliderStyle = Object.assign(sliderStyle, {height: props.geometry.height});

    return (
        <>
            {/* props.geometry contains props.geometry.x, y, width, and height */}
            {/* style = {{position: "absolute", left: props.geometry.x, top: props.geometry.y}} */}
            <Box id="wrapper">
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                >
                    {props.name}
                </Typography>
                <Slider
                    aria-label = {props.name} 
                    style = {sliderStyle}
                    min = {props.min}
                    max = {props.max} 
                    orientation = {props.orientation} 
                    defaultValue = {props.position}
                    step = {props.interval} 
                    valueLabelDisplay = "auto"
                    marks = {props.marks}
                    sx={{
                        color: '#848ccf', 
                        '& .MuiSlider-track': {
                          border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                          height: 24,
                          width: 24,
                          backgroundColor: '#fff',
                          border: '2px solid currentColor',
                          '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                            boxShadow: 'inherit',
                          },
                          '&:before': {
                            display: 'none',
                          },
                        },
                        '& .MuiSlider-valueLabel': {
                          lineHeight: 1.2,
                          fontSize: 12,
                          background: 'unset',
                          padding: 0,
                          width: 32,
                          height: 32,
                          borderRadius: '50% 50% 50% 0',
                          backgroundColor: '#848ccf',
                          transformOrigin: 'bottom left',
                          transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                          '&:before': { display: 'none' },
                          '&.MuiSlider-valueLabelOpen': {
                            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                          },
                          '& > *': {
                            transform: 'rotate(45deg)',
                          },
                        }, 
                      }}
                />
            </Box>
        </>
    );
}

export default MySlider;
