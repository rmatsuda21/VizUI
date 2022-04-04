import React, { useContext } from "react";
import { Radio } from "@mui/material";
import { Box } from "@mui/system";
import { RadioContext } from "../contexts/RadioContext";
import connectToContext from "../contexts/ConnectContext";

// use memo so it reloads on prop or context change
const MyRadio = React.memo(({ props, values, setValues }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
            <Radio
                checked={values[props.group] === props.name}
                onChange={(event) => {
                    let newValues = Object.assign({}, values);
                    newValues[props.group] = event.target.value;
                    setValues(newValues);
                }}
                value={props.name}
                id={props.name}
                name={props.group}
                inputProps={{ "aria-label": props.name }}
            />
            <label htmlFor={props.name}>{props.label}</label>
        </Box>
    );
});

// return radio context parameters
function select() {
    const { values, setValues } = useContext(RadioContext);
    return {
        values: values,
        setValues: setValues,
    };
}

// use to pass context and props to MyRadio
export default connectToContext(MyRadio, select);
