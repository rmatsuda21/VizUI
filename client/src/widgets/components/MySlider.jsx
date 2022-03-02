import React from 'react';
import '../stylesheets/MySlider.css'
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";

function MySlider(props) {
  let sliderStyle = {
    width: '200px',
    margin: '10px 5px 0px 5px'
  };

  return (
    <>
    <div id="wrapper">
      <Typography gutterBottom>{props.label}</Typography>
      <Slider 
          defaultValue = {props.position}
          step = {props.interval}
          min = {props.min}
          max = {props.max}
          style = {sliderStyle}
          valueLabelDisplay="on"
          sx={{
            "& .MuiSlider-thumb": {
              height: 24,
              width: 24,
              backgroundColor: "#fff",
              border: "2px solid currentColor",
              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "inherit"
              }
            },
            // slider value
            "& .MuiSlider-valueLabel": { 
              top: 55, // negative = up, positive = down
              backgroundColor: "unset",
              color: 'black',
              "&:before": {
                display: "none"
              },
            }
          }}
      />
    </div>
    
    </>
  );
};

export default MySlider;