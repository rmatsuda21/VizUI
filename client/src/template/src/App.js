import './App.css';

import MySlider from "./components/MySlider.jsx"
import MyButton from "./components/MyButton.jsx"

function App() {
  return (
    <div className="App">
      <header><h1>Generated App</h1></header>
      <MySlider label="Test Slider" interval={5} position={0}/>
      <br />
      <MyButton label="Test Button"></MyButton>
    </div>
  );
}

export default App;
