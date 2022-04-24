import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/system";

import { useContext } from "react";
import WidgetContext from "../contexts/WidgetContext";
import socket from "../contexts/SocketProvider";

function MyCheckbox(props) {
    // console.log(props.disabled);
    const {widgetVal, appId} = useContext(WidgetContext);
    // const [checked, setchecked] = React.useState(widgetVal ? (widgetVal[props.name] ? widgetVal[props.name] : false) : false);
    const [checked, setchecked] = React.useState(widgetVal ? !widgetVal[props.name] : true);

    function toggle(x){
        return !x;
      }

    async function onSubmit() {
        const checkbox = {appId: appId, data: checked, name: props.name}
        console.log("client side emit: ", checkbox)
        socket.emit("widget", checkbox);
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
                                console.log("before toggle: ", checked);
                                setchecked(toggle(checked))
                                onSubmit();
                                console.log("after toggle: ",checked);
                            }}
                            // defaultChecked={widgetVal ? (widgetVal[props.name] ? widgetVal[props.name] : props.defaultChecked) : props.defaultChecked}
                        />
                    }
                    label={props.label}
                />
            </FormGroup>
        </Box>
    );
}

export default MyCheckbox;
