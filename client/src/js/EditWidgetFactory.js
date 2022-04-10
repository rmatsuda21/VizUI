import { Stack } from "@mui/material";
import { Box } from "@mui/system";
// import { SetTabContextValue, GetTabContextValue } from "../widgets/contexts/TabContext";
import {
    MyButton,
    MyCheckbox,
    MyDial,
    MyDialKnob,
    MyRadio,
    MySlider,
    MyTab,
    MyTabHeader,
    MyTable,
    MyTextField,
} from "../widgets/components";

var curButtonInfo = {
    name: null,
    buttons: [],
};

import { v4 as uuidv4 } from "uuid";
import React from "react";

let data = [];

// Get child widgets from parent
// If parent.layout exists, then it has a layout
export function getEditWidgets(parent, key = 0, dbName = "", d = null) {
    if (d) data = d;

    if (!parent) return [];

    if (key == 0) {
        key = Math.floor(Math.random() * 100);
    }
    // Is Layout
    if ("layout" in parent) {
        let className = parent.layout["@_class"];
        let name = parent.layout["@_name"];

        // Handle Grids
        if (className === "QGridLayout") {
            let gridItems = parseGridItems(parent.layout.item);

            return (
                <Box
                    key={uuidv4()}
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
                key={uuidv4()}
                direction={className === "QHBoxLayout" ? "row" : "column"}
                sx={{ width: "auto", justifyContent: "space-around" }}
                gap={2}
            >
                {items}
            </Stack>
        );
    }

    let widgets = parseWidgets(parent);
    if (widgets == null) return null;

    return <React.Fragment key={uuidv4()}>{widgets}</React.Fragment>;
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
                    sx={{ pointerEvents: "none" }}
                    key={uuidv4()}
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
            let columnName = []; // name of each column
            let rowName = []; // name of each row
            let tableInfo = {}; // dictionary of each row (key) with its data (value)

            object.column.map((column) => {
                columnName.push(column["property"].string);
            });
            object.row.map((row) => {
                rowName.push(row["property"].string);
            });
            let curRow = null;
            object.item.map((tableData, i) => {
                if (curRow == tableData["@_row"]) {
                    tableInfo[rowName[curRow]].push(
                        tableData["property"].string
                    );
                } else {
                    curRow = tableData["@_row"];
                    tableInfo[rowName[curRow]] = [tableData["property"].string];
                }
            });

            return (
                <MyTable
                    sx={{ pointerEvents: "none" }}
                    key={uuidv4()}
                    name={name}
                    columns={columnName}
                    data={tableInfo}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        case "QPushButton":
            return (
                <MyButton
                    sx={{ pointerEvents: "none" }}
                    key={uuidv4()}
                    tooltip={properties.toolTip}
                    confetti={confetti}
                    label={name}
                    name={name}
                    value={"IDK"}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                    variant={"contained"}
                />
            );
        case "QRadioButton": {
            let group =
                object.attribute.string["#text"] ||
                Math.random().toString(36).slice(2);
            let label = properties.text || name;
            return (
                <MyRadio
                    sx={{ pointerEvents: "none" }}
                    key={uuidv4()}
                    group={group}
                    name={name}
                    label={label}
                    size={"medium"}
                    row={false}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        }
        case "QCheckBox": {
            let label = properties.text || name;
            let disabled = false;
            if (typeof properties.checkable !== "undefined") {
                disabled = !properties.checkable;
            }
            let defaultChecked = properties.checked || false;
            return (
                <MyCheckbox
                    sx={{ pointerEvents: "none" }}
                    key={uuidv4()}
                    label={label}
                    disabled={disabled}
                    defaultChecked={defaultChecked}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        }
        case "QDial": {
            let min = properties.minimum || 0;
            let max = properties.maximum || 100;
            return (
                <MyDialKnob
                    sx={{ pointerEvents: "none" }}
                    key={uuidv4()}
                    name={name}
                    min={min}
                    max={max}
                    // position={0}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        }
        case "QTabWidget":
            // set default tab for tab context

            let [tabs, tabNames] = parseTabs(object.widget, name);
            return (
                <Box
                    key={name}
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <MyTabHeader
                        key={name + "header"}
                        name={name}
                        tabNames={tabNames}
                    />
                    <Box key={name + "tabs"}>{tabs}</Box>
                </Box>
            );

        case "QLineEdit": {
            let placeholder = properties.placeholderText || "";
            let disabled = properties.readOnly || false;

            return (
                <MyTextField
                    key={uuidv4()}
                    label={name}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            );
        }

        default:
            return <p key={uuidv4()}>{object["@_class"]}</p>;
    }
}

// Return object of properties from json
function parseProperties(properties) {
    if (!properties) return {};

    // single property
    if (!Array.isArray(properties)) properties = [properties];

    var obj = {};
    Array.prototype.forEach.call(properties, (property) => {
        let key = property["@_name"];
        switch (key) {
            case "geometry":
                obj[key] = property.rect;
                break;
            case "checkable":
            case "checked":
            case "readOnly":
                obj[key] = property.bool;
                break;
            case "windowTitle":
            case "toolTip":
            case "text":
            case "placeholderText":
                obj[key] = property.string;
                break;
            case "singleStep":
            case "minimum":
            case "maximum":
            case "currentIndex":
                obj[key] = property.number;
                break;
            case "orientation":
                obj[key] = property.enum;
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

    if (className === "QTabWidget")
        return widgetParser(className, name, properties, key, widget, "");

    return (
        <Box
            key={uuidv4()}
            sx={{
                zIndex: 10,
                pointerEvents: "",
                borderRadius: 3,
                transition: 'all .2s ease-in-out',
                "&:hover": {
                    bgcolor: "rgba(255, 255, 255, .1)",
                    filter: "brightness(1.2)",
                    cursor: "pointer",
                },
            }}
            onClick={() => console.log(data, name)}
        >
            {widgetParser(className, name, properties, key, widget, "")}
        </Box>
    );
}

// Parse widgets within widget w/ no layout
function parseWidgets(parent) {
    // Is single widget, not container
    if (!("widget" in parent)) {
        return parseWidget(parent, Math.floor(Math.random() * 100));
    }

    return parseWidget(parent.widget, Math.floor(Math.random() * 100));
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
                key={uuidv4()}
            >
                {getEditWidgets(item, key)}
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
        ret.push(getEditWidgets(item));
    });
    return ret;
}

// Parse tabs in containers
function parseTabs(tabs, tabWidgetName) {
    if (!Array.isArray(tabs)) tabs = [tabs]; // Single item

    let parsedTabs = [];
    let tabNames = [];
    tabs.forEach((tab, index) => {
        let tabContents = tab ? getEditWidgets(tab) : null;
        parsedTabs.push(
            <MyTab
                key={`${tabWidgetName}-${index}`}
                group={tabWidgetName}
                index={index}
            >
                {tabContents}
            </MyTab>
        );
        tabNames.push(tab.attribute.string);
    });
    return [parsedTabs, tabNames];
}
