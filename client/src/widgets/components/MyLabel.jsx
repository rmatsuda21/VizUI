import React from "react";
import { Box } from "@mui/system";
import FormLabel from '@mui/material/FormLabel';


function MyLabel(props) {
    
    return ( 
        <FormLabel id={props.name}>
            {props.label}
        </FormLabel>
    );
}

export default MyLabel;
