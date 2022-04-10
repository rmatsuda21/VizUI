import React, { useEffect, useState } from "react";
import { getEditWidgets } from "../js/EditWidgetFactory";
import { TabContextProvider } from "../widgets/contexts/TabContext";

export function EditView(props) {
    const [data, setData] = useState(null);
    const [appName, setAppName] = useState("");

    const getWidgetProperty = (data) => {
        if (!data.ui) return;


    }

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((d) => d.json())
            .then((d) => setData(d));
    }, []);

    console.log(data);

    let widgets = data ? getEditWidgets(data.ui.widget, 0, "hello", data) : <></>;

    return (
        <TabContextProvider>
            {widgets}
        </TabContextProvider>
    );
}
