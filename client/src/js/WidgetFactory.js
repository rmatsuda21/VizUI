import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { uuid } from "uuidv4";
import OrderedDict from 'js-ordered-dict';
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

// Get child widgets from parent
// If parent.layout exists, then it has a layout
export function getWidgets(parent, key = 0, dbName = "") {
    if (!parent) return [];

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
                    key={uuidv4()}
                    sx={{ flexGrow: 1, justifyContent: "space-evenly", height: "100%" }}
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
                sx={{ width: "auto", justifyContent: "space-around", height: "100%" }}
                gap={2}
            >
                {items}
            </Stack>
        );
    }
    console.log(parent);

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
                    key={name}
                    name={name}
                    interval={interval}
                    orientation={properties.orientation}
                    size={properties.size}
                    min={min}
                    max={max}
                    position={0}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        case "QTableWidget":
            let columnName = []  // name of each column
            let rowData = new OrderedDict(); // array of dicts that hold {column: value}
            let columnDefs = [{ field: "rowNames", headerName: "rowID", editable: false }]; // name of columns {field: value}
            let defaultRow = {}; // holds {column names : ""}

            object.column.map((column) => {
                var headerName = column["property"].string;
                var field = headerName.replace(/\s/g, '').toLowerCase()
                columnDefs.push({
                    field: field,
                    headerName: headerName,
                    editable: true
                });

                columnName.push( column["property"].string );

                defaultRow[column["property"].string] = "";
            });

            object.row.map((row, index) => {
                rowData.set(index, {"id": index+1 , "rowNames": row["property"].string, ...defaultRow})
            });

            if (object.item) {
                object.item.map((tableData, i) => {
                    let curRow = tableData["@_row"];
                    let curCol = columnName[tableData["@_column"]];
                    let value = tableData.property["string"];
                    console.log(curRow, curCol, value);
                    rowData.get(curRow)[curCol] = value;
                });
            }

            console.log(name);
            console.log(columnDefs);
            console.log(rowData);

            return (
                <MyTable
                    key={name}
                    name={name}
                    columnDefs = {columnDefs}
                    rowData = {rowData.values()}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        case "QPushButton":
            return (
                <MyButton
                    key={name}
                    tooltip={properties.toolTip}
                    confetti={confetti}
                    label={name}
                    name={name}
                    value={"IDK"}
                    text={properties.text}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                    variant={"contained"}
                />
            );
        case "QRadioButton": {
            let group =
                object.attribute ? object.attribute.string["#text"] :
                Math.random().toString(36).slice(2);
            let label = properties.text || name;
            return (
                <MyRadio
                    key={name}
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
            console.log("defaultChecked: ");
            console.log(defaultChecked);
            return (
                <MyCheckbox
                    key={name}
                    name={name}
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
                    key={name}
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
        case "QLabel":
            return (
                <Box sx={{ display: "flex", alignItems: "center"}}>
                    <Typography variant="h6">{properties.text}</Typography>
                </Box>
                // <Typography
                //     key={name}
                //     tooltip={properties.toolTip}
                //     confetti={confetti}
                //     label={name}
                //     name={name}
                //     value={"IDK"}
                //     geometry={
                //         properties.geometry ? properties.geometry : undefined
                //     }
                //     variant={"contained"}
                // />
            );
        case "QTabWidget":
            // set default tab for tab context

            let [tabs, tabNames] = parseTabs(object.widget, name);
            return (
                <Box
                    key={uuidv4()}
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <MyTabHeader
                        key={uuidv4() + "header"}
                        name={name}
                        tabNames={tabNames}
                    />
                    <Box key={uuidv4() + "tabs"}>{tabs}</Box>
                </Box>
            );

        case "QLineEdit": {
            let placeholder = properties.placeholderText || "";
            let disabled = properties.readOnly || false;

            return (
                <MyTextField
                    key={name}
                    label={name}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            );
        }

        default:
            return <Typography variant="p" key={name}>{object["@_class"]}</Typography>;
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
            case "maximumSize":
                obj[key] = property.size;
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
                if (property.enum == "Qt::Horizontal"){
                    obj[key] = "horizontal";
                }
                else{
                    obj[key] = "vertical";
                }
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

    return widgetParser(className, name, properties, key, widget, "");
}

// Parse widgets within widget w/ no layout
function parseWidgets(parent) {
    // Is single widget, not container
    if (!("widget" in parent)) {
        return parseWidget(parent, Math.floor(Math.random() * 100));
    }

    let widgets = parent.widget;
    if (!Array.isArray(widgets)) widgets = [widgets];

    return widgets.map((widget) => {
        return parseWidget(widget, Math.floor(Math.random() * 100));
    });
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
                key={name}
                sx={{ margin: "auto", height: "100%" }}
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
        ret.push(getWidgets(item));
    });
    return ret;
}

// Parse tabs in containers
function parseTabs(tabs, tabWidgetName) {
    if (!Array.isArray(tabs)) tabs = [tabs]; // Single item

    let parsedTabs = [];
    let tabNames = [];
    tabs.forEach((tab, index) => {
        let tabContents = tab
            ? getWidgets(tab, 0, "", null)
            : null;
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