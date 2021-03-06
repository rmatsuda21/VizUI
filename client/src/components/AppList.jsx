import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useSnackbar } from "notistack";

const DeleteDialog = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                variant: "elevation",
                sx: {
                    bgcolor: "primary.dark",
                    color: "primary.contrastText",
                    textAlign: "center",
                    padding: 0,
                    margin: 0,
                },
            }}
        >
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 600 }}>
                {`Delete "${props.appName}"?`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="alert-dialog-description"
                    sx={{ color: "primary.contrastText" }}
                >
                    This action will be permanent!
                </DialogContentText>
            </DialogContent>
            <DialogActions
                sx={{ display: "flex", justifyContent: "space-evenly" }}
            >
                <Button
                    onClick={() => {
                        props.handleDelete();
                        props.handleClose();
                    }}
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
                <Button
                    onClick={props.handleClose}
                    color="info"
                    variant="contained"
                    autoFocus
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const EmptyItem = (props) => {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    bgcolor: "primary.dark",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    margin: "auto",
                    gap: 4,
                    padding: 8,
                    borderRadius: 2,
                    margin: 2,
                    transition: "all .15s ease-in",
                    "&:hover": {
                        boxShadow: "0px 0px 8px 1px rgba(255,255,255,.3)",
                    },
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    No Apps!
                </Typography>
            </Paper>
        </Box>
    );
};

const AppItem = (props) => {
    const { created, data } = props;
    const date = new Date(data.modified);
    const { enqueueSnackbar } = useSnackbar();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const onDeleteClick = (filename, name) => {
        fetch(`http://localhost:3001/api/db/delete/${filename}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                enqueueSnackbar(`Deleted "${name}"`, { variant: "error" });
                props.deleteApp(filename);
            })
            .catch((e) => enqueueSnackbar(e, { variant: "warning" }));
    };

    return (
        <Paper
            elevation={4}
            sx={{
                bgcolor: "primary.dark",
                color: "primary.contrastText",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "fit-content",
                gap: 4,
                padding: 3,
                borderRadius: 2,
                margin: 2,
                transition: "all .15s ease-in",
                "&:hover": {
                    boxShadow: "0px 0px 8px 1px rgba(255,255,255,.3)",
                },
            }}
        >
            <DeleteDialog
                open={deleteDialogOpen}
                handleClose={handleDialogClose}
                handleDelete={() => {
                    onDeleteClick(data.filename, data.name);
                }}
                appName={data.name}
            />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {data.name}
            </Typography>
            <Button
                variant="contained"
                color={"primary"}
                sx={{ width: "75%" }}
                onClick={() => (window.location = `/view/${data.filename}`)}
            >
                Go to App
            </Button>
            <Button
                variant="contained"
                color={"info"}
                sx={{ width: "75%", color: "primary.contrastText" }}
                onClick={() => (window.location = `/edit/${data.filename}`)}
                startIcon={<EditIcon />}
            >
                Edit
            </Button>
            <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
                <Typography variant="subtitle2">
                    Last Modified: <br />
                    {date.getMonth()}/{date.getDate()}/{date.getFullYear()}
                </Typography>
                <Button
                    variant="contained"
                    color={"error"}
                    size="small"
                    sx={{
                        fontSize: ".5em",
                        height: "4.5em",
                        padding: 0,
                        borderRadius: 10,
                    }}
                    onClick={handleDialogOpen}
                >
                    <DeleteIcon />
                </Button>
            </Box>
        </Paper>
    );
};

export function AppList(props) {
    return (
        <Box
            sx={{
                display: "flex",
                width: "85%",
                minHeight: "350px",
                overflowX: "auto",
                overflowY: "hidden",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "&:-webkit-scrollbar": {
                    display: "none",
                },
            }}
        >
            {props.apps && props.apps.length === 0 ? (
                <EmptyItem />
            ) : (
                props.apps
                    .sort((a, b) => {
                        console.log(a, b);
                        const d1 = new Date(a.data.modified);
                        const d2 = new Date(b.data.modified);

                        return d1 < d2;
                    })
                    .map((app, idx) => {
                        return (
                            <AppItem
                                key={idx}
                                {...app}
                                deleteApp={props.deleteApp}
                            />
                        );
                    })
            )}
        </Box>
    );
}
