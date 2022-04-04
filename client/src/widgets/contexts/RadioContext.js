import React, { useState } from "react";

export const RadioContext = React.createContext({
    values: {},
    setValues: () => {},
});

export function RadioContextProvider(props) {
    const [radioValues, setRadioValues] = useState({});

    const context = {
        values: radioValues,
        setValues: setRadioValues,
    };

    return (
        <RadioContext.Provider value={context}>
            {props.children}
        </RadioContext.Provider>
    );
}
