// import "../stylesheets/home.css";
import React from "react";

import apis from "../js/api";

import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { Box, boxSizing } from "@mui/system";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { AppList } from "./AppList";
import { Dialog, DialogContent } from "@mui/material";
import BasicTable from "./TestTable";
import BasicRowEditingGrid from "./TestTable";
import DataGridDemo from "./TestTable";
import CssTextField from "../mui-styled/CssTextField"
import StartEditButtonGrid from "./TestTable";

const FormData = require("form-data");

const styles = {
    mainContainer: {
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
    },
    fileInput: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3em 4em",
        borderRadius: 3,
        gap: "1em",
        backgroundColor: "primary.dark",
        transition: "box-shadow .1s ease-in-out",
    },
};

const isEmpty = (file) => {
    return file.name ? false : true;
};

const FileUploadForm = (props) => {
    return (
        <Box
            component="form"
            action="/api/convert"
            encType="multipart/form-data"
            method="post"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2em",
                width: "100%",
            }}
        >
            <CssTextField
                id="app-name"
                name="appName"
                label="App Name"
                value={props.fileName}
                onChange={props.handleFileNameChange}
                required
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: "primary.light",
                    width: '100%',
                    padding: 2,
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" color={"primary.contrastText"}>
                    {isEmpty(props.selectedFile)
                        ? "No File Selected"
                        : `${props.selectedFile.name}`}
                </Typography>
                <Box sx={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Button variant="contained" component="label">
                        Select File
                        <input
                            type="file"
                            accept=".ui"
                            name="uiFile"
                            onChange={props.handleFileInput}
                            hidden
                            required
                        />
                    </Button>
                </Box>
            </Box>

            <Button
                type="submit"
                color="success"
                variant="contained"
                disabled={isEmpty(props.selectedFile)}
            >
                Submit
            </Button>
        </Box>
    );
};

const CreateNewApp = (props) => {
    return (
        <Box sx={styles.fileInput}>
            <Typography
                variant="h4"
                sx={{ fontWeight: "1000", color: "primary.contrastText" }}
            >
                Create New App
            </Typography>
            <FileUploadForm
                handleFileInput={props.handleFileInput}
                selectedFile={props.selectedFile}
                fileName={props.fileName}
                handleFileNameChange={props.handleFileNameChange}
            />
        </Box>
    );
};

function Home(props) {
    const [selectedFile, setSelectedFile] = useState({});
    const [fileName, setFileName] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    // useEffect(() => {
    //     props.socket.on("date", (date) => {
    //         console.log(date);
    //     });

    //     return () => {
    //         props.socket.close();
    //     };
    // }, []);

    // const getDate = (e) => {
    //     e.preventDefault();
    //     props.socket.emit("date");
    // };

    const handleFileInput = (e) => {
        e.preventDefault();
        // handle validations
        const file = e.target.files[0];
        if (file.name.split(".")[1].toLowerCase() !== "ui") {
            alert("File must be of type UI");
            e.target.value = null;
        } else {
            setSelectedFile(file);
        }
    };

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };

    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const { apps } = props;

    return (
        <Box sx={styles.mainContainer}>
            <Typography
                variant="h1"
                sx={{
                    transition: "all .2s ease-in-out",
                    "&:hover": { transform: "scale(1.15)" },
                }}
            >
                VizUI
            </Typography>
            <Button
                onClick={handleClickOpen}
                color="success"
                variant="contained"
                size="large"
                sx={{ fontSize: "1em", textTransform: "none" }}
            >
                Create New App
            </Button>
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogContent sx={{ padding: 0 }}>
                    <CreateNewApp
                        handleFileInput={handleFileInput}
                        selectedFile={selectedFile}
                        fileName={fileName}
                        handleFileNameChange={handleFileNameChange}
                    />
                </DialogContent>
            </Dialog>
            <AppList apps={apps} deleteApp={props.deleteApp}/>
            {/* <Button variant="outlined" onClick={getDate}>
                Date Please :3
            </Button> */}
            {/* <StartEditButtonGrid></StartEditButtonGrid> */}
        </Box>
    );
}

export default Home;
