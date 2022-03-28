import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { MyButton, MySlider } from "../widgets/components/";

// Get child widgets from parent
// If parent.layout exists, then it has a layout
export function getWidgets(parent, key = 0) {
    // Is Layout
    if ("layout" in parent) {
        let className = parent.layout["@_class"];

        // Handle Grids
        if (className === "QGridLayout") {
            let gridItems = parseGridItems(parent.layout.item);

            return (
                <Box
                    key={key}
                    sx={{ flexGrow: 1, justifyContent: "space-evenly" }}
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, 1fr)"
                    gap={2}
                >
                    {gridItems}
                </Box>
            );
        }

        let items = parseItems(parent.layout.item);

        return (
            <Stack
                key={key}
                direction={className === "QHBoxLayout" ? "row" : "column"}
                sx={{ width: "100%" }}
                gap={2}
            >
                {items}
            </Stack>
        );
    }

    let widgets = parseWidgets(parent.widget);
    return <>{widgets}</>;
}

// Return JSX element from given widget data from json
function widgetParser(className, name, properties, key, object, confetti) {
    switch (className) {
        case "QSlider":
            let interval = properties.singleStep || 1;
            let min = properties.minimum || 0;
            let max = properties.maximum || 100;
            return (
                <MySlider
                    key={key}
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
                    key={key}
                    tooltip={properties.toolTip}
                    confetti={confetti}
                    label={name}
                    name={name}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        default:
            return <p key={i}>{object["@_class"]}</p>;
    }
}

// Return object of properties from json
function parseProperties(properties) {
    if (!properties) return {};

    var obj = {};
    Array.prototype.forEach.call(properties, (property) => {
        let key = property["@_name"];
        switch (key) {
            case "geometry":
                obj[key] = property.rect;
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

// Parse individual widget
function parseWidget(widget, key = 0) {
    let name = widget["@_name"];
    let className = widget["@_class"];
    let properties = parseProperties(widget.property);

    return widgetParser(className, name, properties, key, widget, "");
}

// Parse widgets within widget w/ no layout
function parseWidgets(parent) {
    // Is single widget, not container
    if (!("widget" in parent))
        return parseWidget(parent, Math.floor(Math.random() * 100));

    const widgets = parent.widget.map((widget, key) => {
        parseWidget(widget, key);
    });

    return widgets;
}

// Parse items for grid
function parseGridItems(items) {
    if (!Array.isArray(items)) items = [items]; // Single item

    let ret = [];
    items.forEach((item, key) => {
        const row = Number.parseInt(item["@_row"]) + 1;
        const col = Number.parseInt(item["@_column"]) + 1;

        const colSpan = "@_colspan" in item ? item["@_colspan"] : "1";
        const rowSpan = "@_rowspan" in item ? item["@_rowspan"] : "1";

        ret.push(
            <Box
                gridColumn={`${col} / span ${colSpan}`}
                gridRow={`${row} / span ${rowSpan}`}
                sx={{ margin: "auto" }}
                key={key}
            >
                {getWidgets(item, key)}
            </Box>
        );
    });
    return ret;
}

// Parse items in containers
function parseItems(items) {
    if (!Array.isArray(items)) items = [items]; // Single item

    let ret = [];
    items.forEach((item, key) => {
        ret.push(getWidgets(item, key));
    });
    return ret;
}
