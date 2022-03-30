import React, { useEffect, useState } from "react";
import { getWidgets } from "../js/WidgetFactory";
import { RadioContextProvider } from "../widgets/contexts/RadioContext";

function AppView(props) {
    const [data, setData] = useState(null);

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    var widgets = data ? getWidgets(data.ui.widget) : [];

    return (
    <RadioContextProvider>
        {widgets}
    </RadioContextProvider>);
}
export default AppView;
