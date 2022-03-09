import React, { useEffect, useState } from "react";
import MySlider from "../widgets/components/MySlider.jsx";
import MyButton from "../widgets/components/MyButton.jsx";
import { Box, breadcrumbsClasses } from "@mui/material";

function parseProperties(properties) {
    var obj = {};
    // console.log(properties);
    Array.prototype.forEach.call(properties, (property) => {
        let key = property["@_name"];
        // console.log("Property type: " + key);
        switch (key) {
            case "geometry":
                obj[key] = property.rect;
                // obj["x"] = property.rect.x
                // obj["y"] = property.rect.y
                // obj["width"] = property.rect.width
                // obj["height"] = property.rect.height
                break;
            case "windowTitle":
                obj[key] = property.string;
                break;
            case "singleStep":
            case "minimum":
            case "maximum":
                obj[key] = property.number;
                break;
            case "orientation":
                obj[key] = property.enum;
                break;
            case "toolTip":
                obj[key] = property.string;
                break;
            default:
                console.log("New property type: " + key);
                break;
        }
    });
    return obj;
}

function widgetParser(className, name, properties, i, object, confetti) {
    switch (className) {
        case "QSlider":
            let interval = properties.singleStep || 1;
            let min = properties.minimum || 0;
            let max = properties.maximum || 100;
            return (
                <MySlider
                    key={i}
                    name={name}
                    interval={interval}
                    min={min}
                    max={max}
                    position={0}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        case "QPushButton":
            return (
                <MyButton
                    tooltip={properties.toolTip}
                    confetti={confetti}
                    key={i}
                    label={name}
                    name={name}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                ></MyButton>
            );
        default:
            return <p key={i}>{object["@_class"]}</p>;
    }
}

function App(props) {
    // TODO: Add function to render this page dynamically based on JSON
    const [data, setData] = useState(null);

    var widgets = data
        ? data.ui.widget.widget.map((object, i) => {
              let name = object["@_name"];
              let className = object["@_class"];
              let properties = parseProperties(object.property);

              return widgetParser(
                  className,
                  name,
                  properties,
                  i,
                  object,
                  props.confetti
              );
          })
        : null;

    // let pageProps = parseProperties(data.ui.widget.property);
    // let title = pageProps.windowTitle || "Example App";
    // let geometry = pageProps.geometry;

    // useEffect(() => {
    //     document.title = title;
    // }, []);

    useEffect(async () => {
        // document.title = title;
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((data) => data.json())
            .then((data) => setData(data));
    }, []);

    return <>{widgets || []}</>;
}

export default App;
