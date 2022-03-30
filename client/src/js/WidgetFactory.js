import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import {
    MyButton,
    MyRadio,
    MySlider,
    MyTable,
    MyDial,
} from "../widgets/components";

var curButtonInfo = {
    name: null,
    buttons: [],
};
// Get child widgets from parent
// If parent.layout exists, then it has a layout
export function getWidgets(parent, key = 0, dbname = '') {
    if (!parent) return []

    if (key == 0) {
        key = Math.floor(Math.random() * 100);
    }
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
                sx={{ width: 'auto', justifyContent: 'space-around' }}
                gap={2}
            >
                {items}
            </Stack>
        );
    }
    let widgets = parseWidgets(parent);
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
        case "QTableWidget":
            console.log("found table!");
            // name of each column
            let columnName = [];
            // name of each row
            let rowName = [];
            // dictionary of each row (key) with its data (value)
            let tableInfo = {};

            object.column.map((column) => {
                columnName.push(column["property"].string);
            });
            object.row.map((row) => {
                rowName.push(row["property"].string);
            });
            let curRow = null;
            object.item.map((tableData, i) => {
                if (curRow == tableData["@_row"]) {
                    // console.log(tableData);
                    tableInfo[rowName[curRow]].push(
                        tableData["property"].string
                    );
                } else {
                    curRow = tableData["@_row"];
                    tableInfo[rowName[curRow]] = [tableData["property"].string];
                }
            });
            // console.log(tableInfo);

            return (
                <MyTable
                    key={key}
                    name={name}
                    columns={columnName}
                    data={tableInfo}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                ></MyTable>
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
                    variant={"contained"}
                />
            );
        case "QRadioButton":
            return (
                <MyRadio
                    key={properties[0][3]}
                    label={name}
                    name={name}
                    buttons={properties}
                    size={"medium"}
                    row={false}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                ></MyRadio>
            );
        case "QDial": {
            let min = properties.minimum || 0;
            let max = properties.maximum || 100;
            return (
                <MyDial
                    key={key}
                    name={name}
                    min={min}
                    max={max}
                    position={0}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        }

        default:
            return <p key={key}>{object["@_class"]}</p>;
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
    let attributes = widget.attribute;
    // let curButtonName = curButtonInfo.name;
    // let curButtons = curButtonInfo.buttons;

    if (className == "QRadioButton") {
        let ret_val = null;
        // check if first button in group
        // console.log(attributes.string["#text"])
        // console.log(curButtonInfo.name)
        if (attributes.string["#text"] != curButtonInfo.name) {
            // first button in group: initialize
            console.log("new QRadioButton");

            // check if prev group exists
            if (curButtonInfo.name != null) {
                // output button group
                console.log(curButtonInfo.buttons[0][0]);
                ret_val = widgetParser(
                    className,
                    curButtonInfo.buttons[0][0],
                    curButtonInfo.buttons,
                    "",
                    "",
                    ""
                );
                console.log(ret_val);
            }
            curButtonInfo.name = attributes.string["#text"];
            curButtonInfo.buttons = [];
            console.log(curButtonInfo.name);
        }

        curButtonInfo.buttons.push([
            curButtonInfo.name,
            widget.property.string,
            properties,
            key,
            widget,
        ]);

        return ret_val;
    } else if (curButtonInfo.name != null) {
        // output button group
        let ret_val = widgetParser(
            "QRadioButton",
            curButtonInfo.buttons[0][0],
            curButtonInfo.buttons,
            "",
            "",
            ""
        );
        curButtonInfo.name = null;
        curButtonInfo.buttons = [];
        return (
            <>
                {ret_val}
                {widgetParser(className, name, properties, key, widget, "")}
            </>
        );
    }

    return widgetParser(className, name, properties, key, widget, "");
}

// Parse widgets within widget w/ no layout
function parseWidgets(parent) {
    // Is single widget, not container
    if (!("widget" in parent)) {
        return parseWidget(
            parent,
            Math.floor(Math.random() * 100),
            curButtonInfo
        );
    }

    return parseWidget(
        parent.widget,
        Math.floor(Math.random() * 100),
        curButtonInfo
    );
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
        ret.push(getWidgets(item, Math.floor(Math.random() * 100)));
    });
    return ret;
}
