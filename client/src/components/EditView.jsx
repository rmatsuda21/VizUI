import React, { useEffect, useState } from "react";
import { getWidgets } from "../js/WidgetFactory";
import { RadioContextProvider } from "../widgets/contexts/RadioContext";
import { TabContextProvider } from "../widgets/contexts/TabContext";

export function EditView(props) {
    const [data, setData] = useState(null);
    const [appName, setAppName] = useState("");

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    console.log(data);

    let widgets = data ? getWidgets(data.ui.widget, 0, "hello") : [];
    console.log('DAWDWA',widgets)
    const editWidgets = widgets.map(widget => {
        return (
            <>
            <h1>TEST</h1>
            {widget}
            </>
        )
    })

    return (
        <TabContextProvider>
            <RadioContextProvider>{editWidgets}</RadioContextProvider>
        </TabContextProvider>
    );
}
