import React from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Fade from "@mui/material/Fade";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from "@mui/x-data-grid";  

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector /> 
      <GridToolbarExport printOptions={{ disableToolbatButton: true }}/>   
      <Tooltip title="Double-click table cell to edit" arrow>
        <IconButton
          sx={{ marginLeft: "auto" }}
          color="primary"
          aria-label="Edit"
          component="span"
          transitioncomponent={Fade}
          transitionprops={{ timeout: 600 }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </GridToolbarContainer>
  );
}

function MyTable(props) {
    const columns = props.columnDefs
    const rows = props.rowData

    return (
        <div style={{ height:"100%"}}>
          <DataGrid
            // autoHeight={true}
            sx={{ minHeight: "300px"}}
            rows={rows}
            columns={columns}
            experimentalFeatures={{ newEditingApi: true }}
            onCellEditStop={(params, event) => {
              // use for taking values into database 
              // params holds the data of the cell that was updated
              // should make sure that it is updated  
            }}
            components={{
              Toolbar: CustomToolbar
            }}
          />
        </div>
      );
}

export default MyTable;