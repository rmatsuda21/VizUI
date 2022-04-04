import React, { useContext } from "react";
import { Box } from "@mui/system";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabContext } from "../contexts/TabContext";
import connectToContext from "../contexts/ConnectContext";

// use memo so it reloads on prop or context change
const MyTabHeader = React.memo(({ props, values, setValues }) => {
    const { children, name, tabNames, ...other } = props;

    return (
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={values[name] || 0}
                onChange={(event, newValue) => {
                    let newValues = Object.assign({}, values);
                    newValues[name] = newValue;
                    setValues(newValues);
                    console.log(newValue);
                }}
                aria-label={name}
            >
                {tabNames.map((tabName, i) => {
                    return (
                        <Tab
                            key={`tab-${name}-${i}`}
                            label={tabName}
                            id={`simple-tab-${name}-${i}`}
                            aria-controls={`simple-tabpanel-${name}-${i}`}
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
});

// return tab context parameters
function select() {
    const { values, setValues } = useContext(TabContext);
    return {
        values: values,
        setValues: setValues,
    };
}

// use to pass context and props to MyTabHeader
export default connectToContext(MyTabHeader, select);
