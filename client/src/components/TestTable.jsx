import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

function EditToolbar(props) {
  const apiRef = useGridApiContext();
  const { selectedCellParams, setSelectedCellParams } = props;

  const handleClick = async () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field, cellMode } = selectedCellParams;
    if (cellMode === 'edit') {
      apiRef.current.stopRowEditMode({ id });
      setSelectedCellParams({ ...selectedCellParams, cellMode: 'view' });
    } else {
      apiRef.current.startRowEditMode({ id });
      setSelectedCellParams({ ...selectedCellParams, cellMode: 'edit' });
    }
  };

  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        justifyContent: 'center',
        display: 'flex',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        disabled={!selectedCellParams}
        color="primary"
      >
        {selectedCellParams?.cellMode === 'edit' ? 'Save' : 'Edit'}
      </Button>
    </Box>
  );
}

EditToolbar.propTypes = {
  selectedCellParams: PropTypes.any,
  setSelectedCellParams: PropTypes.func.isRequired,
};

export default function StartEditButtonGrid() {
  const [selectedCellParams, setSelectedCellParams] = React.useState(null);

  const handleCellClick = React.useCallback((params) => {
    setSelectedCellParams(params);
  }, []);

  const handleCellEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellClick={handleCellClick}
        onCellEditStart={handleCellEditStart}
        onCellEditStop={handleCellEditStop}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: {
            selectedCellParams,
            setSelectedCellParams,
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
        sx={{height:500}}
      />
    </div>
  );
}

const columns = [
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', editable: true },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: randomTraderName(),
    age: 25,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 2,
    name: randomTraderName(),
    age: 36,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 3,
    name: randomTraderName(),
    age: 19,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 4,
    name: randomTraderName(),
    age: 28,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
  {
    id: 5,
    name: randomTraderName(),
    age: 23,
    dateCreated: randomCreatedDate(),
    lastLogin: randomUpdatedDate(),
  },
];
