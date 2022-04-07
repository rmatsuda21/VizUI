import React, { useState, useEffect } from 'react';   
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useComponentWillMount } from "./utils";

export default (props) => {
    let [editing, setEditing] = useState(false);
    let [disabled, setDisabled] = useState(false);

    // custom hook
    useComponentWillMount(() => {
        let editingCells = props.api.getEditingCells();
        if (editingCells.length !== 0) {
            setDisabled(true);
        }
    })

    useEffect(() => {
        props.api.addEventListener('rowEditingStarted', onRowEditingStarted);
        props.api.addEventListener('rowEditingStopped', onRowEditingStopped);

        return () => {
            props.api.removeEventListener('rowEditingStarted', onRowEditingStarted);
            props.api.removeEventListener('rowEditingStopped', onRowEditingStopped);
        };
    }, []);

    function onRowEditingStarted(params) {
        if (props.node === params.node) {
            setEditing(true);
        } else {
            setDisabled(true);
        }
    };

    function onRowEditingStopped(params) {
        if (props.node === params.node) {
            if (isEmptyRow(params.data)) {
                deleteRow(true);
            } else {
                setEditing(false);
            }
        } else {
            setDisabled(false);
        }
    }

    function startEditing() {
        props.api.startEditingCell({
            rowIndex: props.rowIndex,
            colKey: props.column.colId
        });
    }

    function stopEditing(bool) {
        props.api.stopEditing(bool);
    }

    function deleteRow(force = false) {
        let data = props.data;
        let confirm = true;
        if (!force) {
            confirm = window.confirm(`are you sure you want to delete this row: ${JSON.stringify(data)})`)
        }
        if (confirm) {
            props.api.updateRowData({ remove: [data] });
            props.api.refreshCells({ force: true });
        }
    };

    // If an edited row is empty, it is automatically removed 
    function isEmptyRow(data) {
        let dataCopy = { ...data };
        delete dataCopy.id;
        return !Object.values(dataCopy).some(value => value);
    }

    return (
        <div>
            {editing
                ?  
                    <Stack 
                        direction="row" 
                        divider={<Divider orientation="vertical" flexItem />}
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => stopEditing(false)}
                            startIcon={<SaveIcon />}
                            disabled={disabled} 
                        >
                            Update
                        </Button>
                        <Button 
                            color="error"
                            variant="contained"
                            onClick={() => stopEditing(true)}
                            startIcon={<CancelIcon />}
                            disabled={disabled}
                        >
                            Cancel
                        </Button> 
                    </Stack>  
                :   
                    <Stack 
                        direction="row" 
                        divider={<Divider orientation="vertical" flexItem />}
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                    >
                        <Button 
                            color="primary"
                            disableElevation
                            variant="contained" 
                            onClick={startEditing}
                            startIcon={<EditIcon />}
                            disabled={disabled}
                        >
                            Edit
                        </Button>
                        <Button 
                            color="error"
                            disableElevation
                            variant="contained"  
                            onClick={() => deleteRow()}
                            startIcon={<DeleteIcon />}
                            disabled={disabled}
                        >
                            Delete
                        </Button> 
                    </Stack> 
            }
        </div>
    )
}
 