// import "../stylesheets/home.css";
import React from "react";

import apis from "../js/api";

import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Box, boxSizing } from "@mui/system";

const { Component } = require("react");

const theme = createTheme();
theme.typography = {
    fontFamily: "LeagueSpartan",
    h1: {
        fontWeight: 1000,
        fontSize: "3.5em",
    },

    button: { fontWeight: 800 },
    pxToRem: size => `${(size / htmlFontSize) * coef}rem`,
};

const isEmpty = (file) => {
    return file.name ? false : true;
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: {},
        };
    }

    render() {

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
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBlock: "10em",
                        flexDirection: "column",
                        border: "3px solid white",
                        boxSizing: "border-box",
                        color: "white",
                    }}
                >
                    <Typography variant="h1">VizUI</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "3em 4em",
                            borderRadius: "15px",
                            gap: "1em",
                            backgroundColor: "#102841",
                            transition: "box-shadow .1s ease-in-out",
                            "&:hover": {
                                boxShadow: "0px 0px 7px 1px #102841",
                            },
                        }}
                    >
                        <Typography variant="h3">
                            {isEmpty(this.state.selectedFile)
                                ? "No File Selected"
                                : `${this.state.selectedFile.name}`}
                        </Typography>
                        <Box
                            component="form"
                            action="/api/convert"
                            encType="multipart/form-data"
                            method="post"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "2em",
                            }}
                        >
                            <Button variant="contained" component="label">
                                Select File
                                <input
                                    type="file"
                                    accept=".ui"
                                    name="uiFile"
                                    onChange={handleFileInput}
                                    hidden
                                    required
                                />
                            </Button>
                            <Button
                                type="submit"
                                color="success"
                                variant="contained"
                                disabled={isEmpty(this.state.selectedFile)}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default Home;
