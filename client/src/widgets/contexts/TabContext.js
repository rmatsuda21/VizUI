import React, { useState, useContext } from "react";

export const TabContext = React.createContext({
    values: {},
    setValues: () => {},
});

export function TabContextProvider(props) {
    const [tabValues, setTabValues] = useState({});

    const context = {
        values: tabValues,
        setValues: setTabValues,
    };

    return (
        <TabContext.Provider value={context}>
            {props.children}
        </TabContext.Provider>
    );
}
