import React from "react";
import "../stylesheets/MySlider.css";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function MySlider(props) {
    const [value, setValue] = useState(props.position);
    let sliderStyle = {
        margin: '10px 5px 0px 5px'
    };
    
    // props.orientation === 'horizontal'
    //     ? sliderStyle = Object.assign(sliderStyle, {width: props.geometry.width}) 
    //     : sliderStyle = Object.assign(sliderStyle, {height: props.geometry.height});

    //db connection test-------------------------------------
    //creates a new DB entry for each time the slider is changed, allowing user to keep track of historical changes
    // These methods will update the state properties.
    function updatePos(e) {
        set.value(e.target.value)
    }

    // When a post request is sent to the create url, we'll add a new record to the database.
   const newPosition = { ...value };

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
    
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPosition = { data : value };
    
        await fetch("/dbwrite/:db_name/:collection_name", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPosition),
        })
        .catch(error => {
        window.alert(error);
        return;
        });
    

    }
 //end db connection test--------------------------------------------

    const valueUpdate = (position) => {
        setValue(position);
        props.onChange(position)
        console.log(position)
    };

    function PostRequest() {
        fetch("/changed", { method: "POST" })
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
                    defaultValue={props.position}
                    step={props.interval}
                    min={props.min}
                    max={props.max}
                    style={sliderStyle}
                    value = {position}
                    onChange = {updatePos}
                    onChangeCommitted = {onSubmit}
                    valueLabelDisplay="on"
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
