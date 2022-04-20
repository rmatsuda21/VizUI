import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/system";

import { useContext } from "react";
import WidgetContext from "../contexts/WidgetContext";

function MyCheckbox(props) {
    // console.log(props.disabled);
    const {widgetVal, socket, appId} = useContext(WidgetContext);
    const [checked, setchecked] = React.useState(widgetVal[props.name] ? widgetVal[props.name] : false);

    function toggle(value){
        return !value;
      }

    async function onSubmit() {
        const checkbox = {appId: appId, data: checked, name: props.name}
        console.log("client side emit: ", checkbox)
        socket.emit("widget", checkbox);
        widgetVal[prop.name] = checked;
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
                            checked={checked}
                            onChange={(e) => {
                                //socket emit to update checked boxes
                                //console.log(e.target.checked);
                                setchecked(toggle)
                                onSubmit();
                                console.log(checked);

                            }}
                            defaultChecked={widgetVal[props.name] ? widgetVal[props.name] : props.defaultChecked}
                        />
                    }
                    label={props.label}
                />
            </FormGroup>
        </Box>
    );
}

export default MyCheckbox;
