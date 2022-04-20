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
import WidgetContext from "../contexts/WidgetContext";
import socket from "../contexts/SocketProvider";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector /> 
      <GridToolbarExport />   
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
    const {widgetVal, appId} = React.useContext(WidgetContext);

    const columns = props.columnDefs

    const updatedRows = widgetVal[props.name]
    const rows = widgetVal[props.name] ? widgetVal[props.name] : props.rowData

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
              console.log(params) 
              const update = {
                appId: appId,
                name: props.name,
                data: {
                  row: params.row,
                  field: params.field,
                  newValue: event.target.value
                }
              }
              socket.emit("widget", {w: update, widgets: widgetVal}) 
            }}
            components={{
              Toolbar: CustomToolbar
            }}
          />
        </div>
      );
}

export default MyTable;