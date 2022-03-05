import "../stylesheets/home.css";
import React from "react";

import apis from "../api";

import Button from "@mui/material/Button";

const { Component } = require("react");

class Home extends Component {
    constructor() {
        super();
        this.state = {
            selectedFile: {},
        };
    }

    render() {
        console.log(this.state.selectedFile);

        const handleFileInput = (e) => {
            e.preventDefault();
            // handle validations
            const file = e.target.files[0];
            if (file.name.split(".")[1].toLowerCase() !== "ui") {
                alert("File must be of type UI");
                e.target.value = null;
            } else {
                this.setState({ selectedFile: file });
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append("file", this.state.selectedFile);

            apis.convertXML(formData).catch((err) => console.log(err));
        };

        return (
            <div className="App">
                <header>
                    <h1>XML Converter</h1>
                </header>
                <form
                    action="/api/convert"
                    encType="multipart/form-data"
                    method="post"
                >
                    <Button variant="contained" component="label">
                        Upload File
                        <input
                            type="file"
                            accept=".ui"
                            name="uiFile"
                            onChange={handleFileInput}
                            hidden
                        />
                    </Button>
                    <Button type="submit" variant="contained">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export default Home;
