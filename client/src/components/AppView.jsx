import React, { useEffect, useState, createContext } from "react";
import { getWidgets } from "../js/WidgetFactory";
const { io } = require("socket.io-client");
import WidgetContext from "../widgets/widget-context";

const socket = io();

function AppView(props) {
    const [data, setData] = useState(null);
    const [widgetVal, setWidgetVal] = useState({})

    useEffect(async () => {

        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));

        socket.on("change", res => {
            delete res.doc._id
            delete res.doc._rev
            console.log(res.doc)
            setWidgetVal(res.doc)
        })
        
    });

    let widgets = data ? getWidgets(data.ui.widget) : [];

    return (<WidgetContext.Provider value={{widgetVal, setWidgetVal, socket}}>
                {widgets}
            </WidgetContext.Provider>);
}
export default AppView;
