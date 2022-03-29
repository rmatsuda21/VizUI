import React, { useEffect, useState } from "react";
import { getWidgets } from "../js/WidgetFactory";

function AppView(props) {
    // TODO: Add function to render this page dynamically based on JSON
    const [data, setData] = useState(null);

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    var widgets = data ? getWidgets(data.ui.widget) : [];

    return <>{widgets}</>;
}
export default AppView;
