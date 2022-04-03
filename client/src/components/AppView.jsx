import React, { useEffect, useState, createContext } from "react";
import { getWidgets } from "../js/WidgetFactory";
const { io } = require("socket.io-client");
import WidgetContext from "../widgets/widget-context";

function AppView(props) {
    // TODO: Add function to render this page dynamically based on JSON
    const [data, setData] = useState(null);
    const [widgetVal, setWidgetVal] = useState({})

    useEffect(async () => {

        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));

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
}
export default AppView;
