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
        // console.log("New property type: " + key)
        break;
    }
  })
  return obj;
}

function App() {
  // TODO: Add function to render this page dynamically based on JSON

  const data = require("../test.json");


  const widgets_data = data.ui.widget.widget

  // console.log(widgets_data)

  // app.push(<MySlider key={1} label="Test Slider" interval={5} position={0}/>)
  // app.push(<br />)
  // app.push(<><MyButton key={1} label="Test Button"></MyButton><br /></>)

  var widgets = widgets_data.map(function(object, i){
    let name = object["@_name"];
    let className = object["@_class"];
    let properties = parseProperties(object.property);
    // console.log(properties)

    switch (className) {
      case 'QSlider':
        let interval = properties.singleStep || 1
        let min = properties.minimum || 0
        let max = properties.maximum || 100
        return <MySlider key={i} label={name} name={name} interval={interval} min={min} max={max} position={0}/>
      case 'QPushButton':
        return <MyButton key={i} label={name} name={name}></MyButton>
      default:
        return <p key={i}>{object["@_class"]}</p>
    }
    // return <div className={"row"} key={i}> 
    //           {if}
    //        </div>; 
  })

  // console.log(data)



  return (

    <div className="App">
      <header><h1>Generated App</h1></header>
      {widgets}
    </div>
  );
}

export default App;
