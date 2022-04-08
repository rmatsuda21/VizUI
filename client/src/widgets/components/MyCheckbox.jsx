import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/system";

function MyCheckbox(props) {
    console.log(props.disabled);
    const [checked, setchecked] = React.useState(0); 
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <FormGroup>
                <FormControlLabel
                    disabled={props.disabled}
                    control={<Checkbox value={props.label}
                        onChange={(e) => {
                            
                        }}/>}
                    label={props.label}
                />
            </FormGroup>
        </Box>
    );
}

export default MyCheckbox;
