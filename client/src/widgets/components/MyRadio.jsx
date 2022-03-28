// import "../stylesheets/MyButton.css";
import React, { useState } from "react";
import { Radio, RadioGroup } from "@mui/material";
import { FormControl, FormLabel, FormControlLabel } from "@mui/material"; 
import { Box } from "@mui/system";

// import { Radio, RadioGroup } from "@material-ui/core";
// import { FormControl, FormLabel, FormControlLabel } from "@material-ui/core"; 
// import { Box } from "@material-ui/core";

function MyRadio(props) { 

    const [category, setCategory] = useState('')

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: '1em'}}>
            <FormControl>
                <FormLabel> Radio Button </FormLabel>
                <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)}>
                    <FormControlLabel value = { props.label } control={<Radio />} label = { props.label } />
                    <FormControlLabel value = { "big money" } control={<Radio />} label = { props.label } />
                    <FormControlLabel value = { props.label } control={<Radio />} label = { props.label } />
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default MyRadio;
