import MySlider from "../widgets/components/MySlider.jsx"
import MyButton from "../widgets/components/MyButton.jsx"

function App() {
  // TODO: Add function to render this page dynamically based on JSON

  return (
    // { APP }

    <div className="App">
      <header><h1>Generated App</h1></header>
      <MySlider label="Test Slider" interval={5} position={0}/>
      <br />
      <MyButton label="Test Button"></MyButton>
    </div>
  );
}

export default App;
