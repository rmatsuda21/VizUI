import React, { useEffect, useState } from "react";
import MySlider from "../widgets/components/MySlider.jsx";
import MyTable from "../widgets/components/MyTable.jsx";
import MyButton from "../widgets/components/MyButton.jsx";
import MyRadio from "../widgets/components/MyRadio.jsx";
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
              switch (property.enum) {
                case "Qt::Horizontal":
                  obj[key] = "horizontal";
                  break;
                case "Qt::Vertical":
                  obj[key] = "vertical";
                  break;
              }
              break;
            case "text":
                obj[key] = property.string;
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
            let orientation = properties.orientation || "horizontal"
            return (
                <MySlider
                    key={i}
                    name={name}
                    interval={interval}
                    min={min}
                    max={max}
                    position={0}
                    marks = {false} 
                    orientation={orientation}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                />
            );
        case "QTableWidget":
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
                    key={i}
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
                    tooltip={properties.toolTip}
                    confetti={confetti}
                    key={i}
                    label={name}
                    name={name}
                    variant = {"contained"} 
                    size = {"medium"} 
                    disabled = {false} 
                    disabledElevation= {false}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                ></MyButton>
            );
        case "QRadioButton":
            return (
                <MyRadio 
                    key={i}
                    label={properties.text} 
                    name={name} 
                    size = {"medium"} 
                    disabled = {false} 
                    row = {false}
                    geometry={
                        properties.geometry ? properties.geometry : undefined
                    }
                ></MyRadio>
            );
        default:
            return <p key={i}>{object["@_class"]}</p>;
    }
}

function App(props) {
    // TODO: Add function to render this page dynamically based on JSON
    const [data, setData] = useState(null);

    var buttonGroups = {}

    var widgets = data
        ? data.ui.widget.widget.map((object, i) => {
            let name = object["@_name"];
            let className = object["@_class"];
            let properties = parseProperties(object.property);
            

            if ( className == "QRadioButton" ) { 
                if ( object.attribute.string["#text"] in buttonGroups ) {
                    buttonGroups[object.attribute.string["#text"]].push([className, name, properties, i, object]);
                }
                else{ 
                    buttonGroups[object.attribute.string["#text"]] = [[className, name, properties, i, object]];
                }

                return  
            } 

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

        console.log(buttonGroups)

        console.log(widgets) 

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
