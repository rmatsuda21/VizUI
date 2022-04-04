import React, { useEffect, useState, createContext } from "react";
import { getWidgets } from "../js/WidgetFactory";
<<<<<<< HEAD
const { io } = require("socket.io-client");
import WidgetContext from "../widgets/widget-context";
=======
import { RadioContextProvider } from "../widgets/contexts/RadioContext";
import { TabContextProvider } from "../widgets/contexts/TabContext";
>>>>>>> develop

function AppView(props) {
    const [data, setData] = useState(null);
    const [widgetVal, setWidgetVal] = useState({})

    useEffect(async () => {

        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));

<<<<<<< HEAD
        const socket = io();

        socket.on("update", res => {
            console.log(res.updateDescription.updatedFields)
            setWidgetVal(res.updateDescription.updatedFields)
        })
        
    });

    let widgets = data ? getWidgets(data.ui.widget) : [];

    return (<WidgetContext.Provider value={{widgetVal, setWidgetVal}}>
                {widgets}
            </WidgetContext.Provider>);
=======
    console.log(data);

    var widgets = data ? getWidgets(data.ui.widget, 0, "hello") : [];

    return (
        <TabContextProvider>
            <RadioContextProvider>{widgets}</RadioContextProvider>
        </TabContextProvider>
    );
>>>>>>> develop
}
export default AppView;
