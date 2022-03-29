// import "../stylesheets/MyButton.css";
import React, { useState } from "react";
import { Radio, RadioGroup } from "@mui/material";
import { FormControl, FormLabel, FormControlLabel } from "@mui/material"; 
import { Box } from "@mui/system";

function MyRadio(props) { 

    const [category, setCategory] = useState('')

    return (
        <Box sx={{display: 'flex', alignItems: 'center', gap: '1em'}}>
            <FormControl>
                <FormLabel> { props.label } </FormLabel>
                <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)}>
                    {props.buttons.map((button, index) => (  
                        <FormControlLabel value = { button[1] } control={<Radio />} label = { button[1] } /> 
                    ))} 
                </RadioGroup>
            </FormControl>
        </Box>
    );
}

export default MyRadio;
