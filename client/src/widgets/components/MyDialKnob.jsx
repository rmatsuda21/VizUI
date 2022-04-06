import React, { useState } from "react";
import "../stylesheets/MyDialKnob.css";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { HighContrast } from 'react-dial-knob'

function MyDialKnob(props) {
    const [value, setValue] = useState(0);
    const [count, setCount] = React.useState(0);
    const countUpdate = () => {
            // Dealing with name field changes to update our state
            setCount(count + 1);
        };

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
                <HighContrast
                    diameter={200}
                    min={0}
                    max={100}
                    step={1}
                    value={value}
                    theme={{
                        defaultColor: 'black',
                        activeColor: "#848ccf"
                    }}
                    style={{
                        position: "relative",
                        margin: "100px auto",
                        width: "200px"
                      }}
                    onValueChange={setValue}
                    onInteractionChange={() => {countUpdate();}}
                    >
                        <label
                            id={"my-label"}
                            style={{
                            textAlign: "center",
                            width: "200px",
                            display: "block",
                            padding: "10px 0"
                            }}
                        >
                            interaction change ticker:
                            {count}
                        </label>
                </HighContrast>
            </Box>
        </>
    );
}

export default MyDialKnob;
