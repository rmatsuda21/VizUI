import React, { useContext } from "react";
import { Box } from "@mui/system";
import { TabContext } from "../contexts/TabContext";
import connectToContext from "../contexts/ConnectContext";

// use memo so it reloads on prop or context change
const MyTab = React.memo(({
    props,
    values,
    setValues
}) => { 

    const { children, group, index, ...other } = props;
    
    return (
        <div
            role="tabpanel"
            hidden={values[group] ? values[group] !== index : index !== 0}
            id={`simple-tabpanel-${group}-${index}`}
            aria-labelledby={`simple-tab-${group}-${index}`}
        >
            <Box sx={{ p: 3 }}>
                {children}
            </Box>
        </div>
    );
})

// return tab context parameters
function select(){
    const { values, setValues } = useContext(TabContext);
    return {
      values: values,
      setValues: setValues
    }
}

// use to pass context and props to MyTab
export default connectToContext(MyTab, select);
