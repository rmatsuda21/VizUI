import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import OrderedDict from 'js-ordered-dict';
// import { SetTabContextValue, GetTabContextValue } from "../widgets/contexts/TabContext";
import {
    MyButton,
    MyCheckbox,
    MyDial,
    MyLabel,
    MyRadio,
    MySlider,
    MyTab,
    MyTabHeader,
    MyTable,
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
            let rowName = []; // name of each row 
            let columnName = []  // name of each column
            let rowData = new OrderedDict(); // array of dicts that hold {column: value}
            let columnDefs = []; // name of columns {field: value}
            let defaultRow = {}; // holds {column names : ""}   

            object.column.map((column) => {
                columnDefs.push({
                    field: column["property"].string, 
                    cellEditor: "simpleEditor" 
                });
                
                columnName.push( column["property"].string );

                defaultRow[column["property"].string] = ""; 
            });

            object.row.map((row) => {
                rowName.push(row["property"].string);
                rowData.set(row["property"].string, {"id": row["property"].string, ...defaultRow}) 
            });

            if (object.item) { 
                object.item.map((tableData, i) => {
                    let curRow = rowName[tableData["@_row"]]
                    let curCol = columnName[tableData["@_column"]]
                    let value = tableData.property["string"] 
                    rowData.get(curRow)[curCol] = value;
                });
            }

            return (
                <MyTable
                    key={key}
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
                    key={key}
                    tooltip={properties.toolTip}
                    confetti={confetti}
                    label={name}
                    name={name}
                    // value={value}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                    variant={"contained"}
                />
            );
        case "QRadioButton": {
            let group = object.attribute.string["#text"] || Math.random().toString(36).slice(2);
            let label = properties.text || name;
            return (
                <MyRadio 
                    key={key}
                    group={group} 
                    name={name}
                    label={label}
                    size = {"medium"}  
                    row = {false}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        }
        case "QCheckBox": {
            let label = properties.text || name;
            let disabled = false;
            if (typeof properties.checkable !== 'undefined') {
                disabled = !properties.checkable;
            }
            return (
                <MyCheckbox
                    key={key}
                    label={label}
                    disabled={disabled}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        }
        case "QLabel": {
            let label = properties.text || name; 
            return (
                <MyLabel
                    key={key} 
                    name={name}
                    label={label}
                />
            );
        }
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
        case "QTabWidget":
            // set default tab for tab context

            let [tabs, tabNames] = parseTabs(object.widget, name);
            console.log(tabNames)
            console.log(tabs)
            return (
                <>
                    <MyTabHeader
                        key={key}
                        name={name}
                        tabNames={tabNames}
                    />
                    {tabs}
                </>
            )

        default:
            return <p key={key}>{object["@_class"]}</p>;
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
                obj[key] = property.bool;
                break;
            case "windowTitle":
            case "toolTip":
            case "text":
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
        return parseWidget(
            parent,
            Math.floor(Math.random() * 100)
        );
    }

    return parseWidget(
        parent.widget,
        Math.floor(Math.random() * 100)
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
        let tabContents = tab.widget ? getWidgets(tab.widget) : null;
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
