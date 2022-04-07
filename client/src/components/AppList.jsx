import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DeleteDialog = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{variant: 'elevation', sx: {bgcolor: 'primary.dark', color: 'primary.contrastText', textAlign: 'center', padding: 0, margin: 0}}}
        >
            <DialogTitle id="alert-dialog-title" sx={{fontWeight: 600}}>
                {`Delete "${props.appName}"?`}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{color: "info.main"}}>
                This action will be permanent!
            </DialogContentText>
            </DialogContent>
            <DialogActions sx={{display: 'flex', justifyContent: "space-evenly"}}>
                <Button onClick={props.handleDelete} color="error" variant="contained">Delete</Button>
                <Button onClick={props.handleClose} color="info" variant="contained" autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AppItem = (props) => {
    const { created, data } = props;
    const date = new Date(data.modified);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const handleDialogOpen = () => {
        setDeleteDialogOpen(true);
    }

    const handleDialogClose = () => {
        setDeleteDialogOpen(false);
    }

    const onDeleteClick = () => {
        //Delete Item
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
            }}
        >
            <DeleteDialog open={deleteDialogOpen} handleClose={handleDialogClose} handleDelete={onDeleteClick} appName={data.name}/>
            <Typography variant="h5" sx={{fontWeight: 800}}>{data.name}</Typography>
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
                sx={{ width: "75%" }}
                onClick={() => (window.location = `/edit/${data.filename}`)}
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
                        fontSize: ".75em",
                        height: "2.5em",
                        paddingInline: 3,
                    }}
                    onClick={handleDialogOpen}
                >
                    Delete
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
                overflow: "scroll",
            }}
        >
            {props.apps.map((app, idx) => {
                return <AppItem key={idx} {...app} />;
            })}
        </Box>
    );
}
