import React, { useEffect, useState } from "react";
import { getWidgets } from "../js/WidgetFactory";
import { RadioContextProvider } from "../widgets/contexts/RadioContext";
import { TabContextProvider } from "../widgets/contexts/TabContext";

function AppView(props) {
    const [data, setData] = useState(null);

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    console.log(data);

    var widgets = data ? getWidgets(data.ui.widget, 0, "hello") : [];

    return (
        <TabContextProvider>
            <RadioContextProvider>{widgets}</RadioContextProvider>
        </TabContextProvider>
    );
}
export default AppView;
