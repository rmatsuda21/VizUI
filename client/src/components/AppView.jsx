import React, { useEffect, useState, createContext } from "react";
import { getWidgets } from "../js/WidgetFactory";
import WidgetContext from "../widgets/contexts/WidgetContext";
import { RadioContextProvider } from "../widgets/contexts/RadioContext";
import { TabContextProvider } from "../widgets/contexts/TabContext";
import socket from "../widgets/contexts/SocketProvider";

function AppView(props) {
    const [data, setData] = useState(null);
    const [widgetVal, setWidgetVal] = useState({});
    const [appName, setAppName] = useState("");

    useEffect( () => {
        // await new Promise((r) => setTimeout(r, 350));
        fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));

        socket.emit("loadWidgets", props.id);

        socket.on("allWidgets", (widgets) => {
            if (widgets.length > 0) {
                let widgetState = {};
                widgets.forEach((w) => (widgetState[w.id] = w.doc.data));
                setWidgetVal(widgetState);
            }
        });

        socket.on("change", change => {
            console.log(change)
            setWidgetVal(change)
        });
    }, []);

    var widgets = data ? getWidgets(data.ui.widget, 0, "hello") : [];

    return (
        <TabContextProvider>
            <RadioContextProvider>
                <WidgetContext.Provider
                    value={{ widgetVal, appId: props.id }}
                >
                    {widgets}
                </WidgetContext.Provider>
            </RadioContextProvider>
        </TabContextProvider>
    );
}

export default AppView;
