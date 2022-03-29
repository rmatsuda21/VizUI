import '../stylesheets/home.css';
import React from 'react'

import apis from "../api";

const { Component } = require("react");

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: {}
        }
    }

  render() {

    this.props.socket.on('update', (data) => {
        console.log(data)
    })

    const getDate = (e) => {
        e.preventDefault();
        this.props.socket.emit('date')
    }

    const handleFileInput = (e) => {
        e.preventDefault();
        // handle validations
        const file = e.target.files[0];
        if (file.name.split('.')[1].toLowerCase() !== "xml") {
            alert("File must be of type XML");
            e.target.value = null;
        }
        else {
            this.setState({selectedFile: file});
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", this.state.selectedFile);
      
        apis.convertXML(formData)
            .then((window.location = "/edit"))
            .catch((err) => console.log(err));

        
    };

    return (
        <div className="App">
        <header><h1>XML Converter</h1></header>
        <form>
            <input type="file" accept=".xml" onChange={handleFileInput}/>
            <button onClick={handleSubmit}>Submit</button>
        </form>
        <button onClick={getDate}>date pls</button>
        </div>
    );
  }
};

export default Home;
