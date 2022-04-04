import React, { useState } from "react";
import "../stylesheets/MyDial.css";
import CircularSlider from "@fseehawer/react-circular-slider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import { HighContrast } from "react-dial-knob";

function MyDial(props) {
    const [value, setValue] = useState(0);

    let sliderStyle = {
        width: "200px",
        margin: "10px 5px 0px 5px",
    };
    function updatePos(e) {
        set.value(e.target.value);
    }

    // This function will handle the submission once the slider is released
    async function onSubmit(e) {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPosition = { data: value };

        await fetch(`/dbwrite/${props.dbName}/${props.name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPosition),
        }).catch((error) => {
            window.alert(error);
            return;
        });
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
                <CircularSlider
                    // defaultValue={props.position}
                    onChange={updatePos}
                    label={props.name}
                    min={props.min}
                    max={props.max}
                    labelColor="#848ccf"
                />
                {/* <HighContrast
                    diameter={200}
                    min={props.min}
                    max={props.max}
                    step={1}
                    value={value}
                    theme={{
                        defaultColor: '#848ccf',
                        activeColor: 'blue'
                    }}
                    onValueChange={setValue}
                    ariaLabelledBy={'my-label'}
                >
                    <label id={'my-label'}>Some label</label>
                </HighContrast> */}
            </Box>
        </>
    );
}

export default MyDial;
