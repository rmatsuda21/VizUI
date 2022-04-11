import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/system";

function MyCheckbox(props) {
    console.log(props.disabled);
    const [checked, setchecked] = React.useState(0);

    async function onSubmit() {
        // const socket = io();
        // socket.emit("updateCheckboxValue", value);
        // console.log("socket emit: updated Dial val to ", value)
    }

    return (
        <Box
            sx={{
                ...props.sx,
                display: "flex",
                alignItems: "center",
                gap: "1em",
            }}
        >
            <FormGroup>
                <FormControlLabel
                    disabled={props.disabled}
                    control={
                        <Checkbox
                            value={props.label}
                            onChange={(e) => {
                                //socket emit to update checked boxes
                                onSubmit();
                            }}
                            defaultChecked={props.defaultChecked}
                        />
                    }
                    label={props.label}
                />
            </FormGroup>
        </Box>
    );
}

export default MyCheckbox;
