import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { uuid } from "uuidv4";
import OrderedDict from 'js-ordered-dict';

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
export function saveWidgets(curJson, newProperties) {
    if (!curJson) return [];

    // Is Layout
    if ("layout" in curJson) {
        let className = curJson.layout["@_class"];

        // Handle Grids
        if (className === "QGridLayout") {
            saveGridItems(curJson.layout.item, newProperties);
        }

        saveItems(curJson.layout.item, newProperties);
    }
    // console.log(curJson);

    saveRegularWidgets(curJson, newProperties);
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
            let columnDefs = [{ field: "rowNames", headerName: "", editable: false }]; // name of columns {field: value}
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

            // console.log(name);
            // console.log(columnDefs);
            // console.log(rowData);

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
                object.attribute.string["#text"] ||
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
            // console.log("defaultChecked: ");
            // console.log(defaultChecked);
            return (
                <MyCheckbox
                    key={name}
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
            );
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
function saveProperties(properties, newProperties) {
    
    // console.log("saving properties")
    if (!properties) return;
    if (!newProperties) return;
    // console.log("saving properties actually")

    // single property
    if (!Array.isArray(properties)) properties = [properties];

    Array.prototype.forEach.call(properties, (property) => {
        // console.log("trying to save property")
        let key = property["@_name"];
        if (!(key in newProperties)) {
            console.log("key not in properties!")
            console.log(newProperties)
            return;
        }
        console.log(key)

        switch (key) {
            case "maximumSize":
                // size
                property.size = newProperties[key];                   
                break;
            case "checkable":
            case "checked":
            case "readOnly":
                // bool
                property.bool = newProperties[key];
                break;
            case "windowTitle":
            case "toolTip":
            case "text":
            case "placeholderText":
                // string
                property.string = newProperties[key];
                break;
            case "singleStep":
            case "minimum":
            case "maximum":
            case "currentIndex":
                // number
                console.log("setting max?")
                property.number = newProperties[key];
                break;
            case "orientation":
                // horizontal/vertical
                if (newProperties[key] == "horizontal"){
                    property.enum = "Qt::Horizontal";
                }
                else{
                    property.enum = "Qt::Vertical";
                }
                break;
            default:
                console.log("New property type: " + key);
                break;
        }
    });
}

// Save individual widget properties
function saveWidget(widget, properties) {
    let name = widget["@_name"];

    if (name in properties) {
        saveProperties(widget.property, properties[name]);
    }

    // let className = widget["@_class"];
    // let properties = parseProperties(widget.property);
    // let attributes = widget.attribute;
    // let curButtonName = curButtonInfo.name;
    // let curButtons = curButtonInfo.buttons;

    // return widgetParser(className, name, properties, key, widget, "");
}

// Parse widgets within widget w/ no layout
function saveRegularWidgets(curJson, properties) {
    // Is single widget, not container
    if (!("widget" in curJson)) {
        return saveWidget(curJson, properties);
    }

    let widgets = curJson.widget;
    if (!Array.isArray(widgets)) widgets = [widgets];

    widgets.forEach((widget, key) => {
        saveWidgets(widget, properties);
    });
}

// Save items for grid
function saveGridItems(items, properties) {
    if (!Array.isArray(items)) items = [items]; // Single item

    items.forEach((item, key) => {
        saveWidgets(item, properties);
    });
}

// Parse items in containers
function saveItems(items, properties) {
    if (!Array.isArray(items)) items = [items]; // Single item

    items.forEach((item, key) => {
        saveWidgets(item, properties);
    });
}

// Parse tabs in containers
function parseTabs(tabs, tabWidgetName) {
    if (!Array.isArray(tabs)) tabs = [tabs]; // Single item

    let parsedTabs = [];
    let tabNames = [];
    tabs.forEach((tab, index) => {
        let tabContents = tab.widget ? saveWidgets(tab.widget) : null;
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
