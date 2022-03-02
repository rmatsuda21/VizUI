import MySlider from "../widgets/components/MySlider.jsx"
import MyButton from "../widgets/components/MyButton.jsx"
import { breadcrumbsClasses } from "@mui/material";

function parseProperties(properties) {
  var obj = {};
  console.log(properties)
  Array.prototype.forEach.call(properties, property => {
    let key = property["@_name"]
    console.log("Property type: " + key)
    switch (key) {
      case "geometry":
        obj["geometry"] = true
        obj["x"] = property.rect.x
        obj["y"] = property.rect.y
        obj["width"] = property.rect.width
        obj["height"] = property.rect.height
        break;
      case "singleStep":
      case "minimum":
      case "maximum":
        obj[key] = property.number;
        break;
      case "orientation":
        obj[key] = property.enum;
        break;
      default:
        console.log("New property type: " + key)
        break;
    }
  })
  return obj;
}

function App() {
  // TODO: Add function to render this page dynamically based on JSON

  const data = require("../test.json");

  var widgets = data.ui.widget.widget.map(function(object, i){
    let name = object["@_name"];
    let className = object["@_class"];
    let properties = parseProperties(object.property);

    switch (className) {
      case 'QSlider':
        let interval = properties.singleStep || 1
        let min = properties.minimum || 0
        let max = properties.maximum || 100
        return <MySlider key={i} label={name} name={name} interval={interval} min={min} max={max} position={0}
                          x={properties.x ? properties.x : undefined} y={properties.y ? properties.y : undefined}
                          width={properties.width ? properties.width : undefined}
                          height={properties.height ? properties.height : undefined}/>
      case 'QPushButton':
        return <MyButton key={i} label={name} name={name} 
                  x={properties.x ? properties.x : undefined} 
                  y={properties.y ? properties.y : undefined} 
                  width={properties.width ? properties.width : undefined} 
                  height={properties.height ? properties.height : undefined}></MyButton>
      default:
        return <p key={i}>{object["@_class"]}</p>
    }
  })

  return (

    <div className="App">
      <header><h1>Generated App</h1></header>
      {widgets}
    </div>
  );
}

export default App;
