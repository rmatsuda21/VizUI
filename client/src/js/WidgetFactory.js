import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { MyButton, MyRadio, MySlider, MyTable, MyDial } from "../widgets/components";

var curButtonInfo = {
    name: null,
    buttons: []
}
// Get child widgets from parent
// If parent.layout exists, then it has a layout
export function getWidgets(parent, key = 0) {
    if (key == 0) {
        key = Math.floor(Math.random() * 100);
    };
    // Is Layout
    // console.log(parent)
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
        console.log(items.length);
        console.log(items);
        
        console.log(parent)
        if (items[0] == null) {
            console.log("yay");
            return null;
        }
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
    console.log("hi")
    let widgets = parseWidgets(parent);
    console.log(widgets)
    console.log(parent)
    if (widgets == null) {
        return null;
    }
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
            console.log("found table!")
            // name of each column 
            let columnName = [];
            // name of each row 
            let rowName = [];
            // dictionary of each row (key) with its data (value) 
            let tableInfo = {} 

            object.column.map((column) => {
                columnName.push(column["property"].string);
            }) 
            object.row.map((row) => {
                rowName.push(row["property"].string);
            })
            let curRow = null;  
            object.item.map((tableData, i) => {  
                if ( curRow == tableData["@_row"] ) {
                    // console.log(tableData);
                    tableInfo[rowName[curRow]].push(tableData["property"].string);
                }
                else{
                    curRow = tableData["@_row"];
                    tableInfo[rowName[curRow]] = [tableData["property"].string];
                }
            })
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
                />
            );
        case "QRadioButton":
            let group = object.attribute.string["#text"] || Math.random().toString(36).slice(2);
            return (
                <MyRadio 
                    key={key}
                    group={group} 
                    name={name}
                    size = {"medium"}  
                    row = {false}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                >hi</MyRadio>
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

    return widgetParser(className, name, properties, key, widget, "");
}

// Parse widgets within widget w/ no layout
function parseWidgets(parent) {
    
    
    // Is single widget, not container
    if (!("widget" in parent)){
        console.log("chi")
        return parseWidget(parent, Math.floor(Math.random() * 100), curButtonInfo);
    }

    // console.log(parent)
    // const widgets = parent.widget.map((widget, key) => {
    //     console.log("here2")
        
    // });
    return parseWidget(parent.widget, Math.floor(Math.random() * 100), curButtonInfo);

    // return widgets;
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
