import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react"; 
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import SimpleEditor from "./SimpleEditor";
import ActionsRenderer from "./ActionsRenderer";
import AddRowStatusBar from "./AddRowStatusBar"; 

function MyTable(props) { 

    let rowId = [{
        headerName: 'Row ID', 
        valueGetter: 'node.id',
        editable: false
    }]
    let buttonActions = [{ 
        headerName: "action",
        colId: "actions",
        cellRenderer: "actionsRenderer",
        editable: false,
        filter: false,
        minWidth: 220
    }]
    let colData = [...rowId, ...props.columnDefs, ...buttonActions] 

    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [columnDefs] = useState(colData); 
    const [rowData] = useState(props.rowData);

    const gridStyle = useMemo(() => ({ height: 400, width: 600 }), []); 

    const defaultColDef = {
        editable: true,
        resizable: true,
        filter: true,
        floatingFilter: true,
        suppressKeyboardEvent: params => params.editing
    };

    const getRowId = useCallback((params) => params.data.id, []);

    const frameworkComponents = {
        simpleEditor: SimpleEditor, 
        actionsRenderer: ActionsRenderer
    }

    console.log(AddRowStatusBar)
    console.log('addRowStatusBar')

    function onGridReady(params) {
        setGridApi(params.api);
        setColumnApi(params.columnApi);     
    } 

    return (
        <div> 
            <div className="add-btn-container">
                <button 
                    color="primary" 
                >Add Row</button>
            </div>
            <div
                id={props.name}
                style={gridStyle}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                    getRowId={getRowId}
                    onGridReady={onGridReady}
                    frameworkComponents={frameworkComponents}
                    editType="fullRow"
                    suppressClickEdit 
                ></AgGridReact>
            </div>
        </div>
    );
}

export default MyTable;