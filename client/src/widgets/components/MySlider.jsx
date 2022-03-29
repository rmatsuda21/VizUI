import React, { useState } from "react";
import "../stylesheets/MySlider.css";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

function MySlider(props) {
    var [value, setValue] = useState({
        position: 0
    });
    let sliderStyle = {
        width: "200px",
        margin: "10px 5px 0px 5px",
    };

    //db connection test-------------------------------------
    //creates a new DB entry for each time the slider is changed, allowing user to keep track of historical changes
    // These methods will update the state properties.
    function updatePos(position) {
        return setPos((prev) => {
        return { ...prev, ...position };
        });
    }

    // When a post request is sent to the create url, we'll add a new record to the database.
   const newPosition = { ...value };

    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
    
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPosition = { ...value };
    
        await fetch("/changed", {
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
    
        setForm({position: 0});
        navigate("/");
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
            <Box id="wrapper">
                <Typography variant="h3" gutterBottom sx={{textAlign: 'center'}}>{props.name}</Typography>
                <Slider
                    defaultValue={props.position}
                    step={props.interval}
                    min={props.min}
                    max={props.max}
                    style={sliderStyle}
                    value = {position}
                    //onChange={valueUpdate}
                    onChange = {
                        (e, val) => this.props.update(e, control.id, val) 
                    }
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
