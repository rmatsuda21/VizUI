import React, { useState, useEffect } from "react";
import { uuid } from "uuidv4";

// import "./AddRowStatusBar.css";

export default props => {
  let [editing, setEditing] = useState(false);

  useEffect(() => {
    props.api.addEventListener("rowEditingStarted", onRowEditingStarted);
    props.api.addEventListener("rowEditingStopped", onRowEditingStopped);

    return () => {
      props.api.removeEventListener("rowEditingStarted", onRowEditingStarted);
      props.api.removeEventListener("rowEditingStopped", onRowEditingStopped);
    };
  }, []);

  function onRowEditingStarted() {
    setEditing(true);
  }

  function onRowEditingStopped() {
    setEditing(false);
  }

  function addRow() {
    let id = uuid();
    let emptyRow = { id };
    props.api.updateRowData({ add: [emptyRow] });
    let node = props.api.getRowNode(id);
    props.api.ensureIndexVisible(node.rowIndex);

    setTimeout(() => {
      props.api.startEditingCell({
        rowIndex: node.rowIndex,
        colKey: props.columnApi.getAllColumns()[0].colId
      });
    }, 300);
  }

  return (
    <div className="add-btn-container">
      <button
        variant={editing ? "outlined" : "contained"}
        color="primary"
        onClick={addRow}
        disabled={editing}
      >
        Add Row
      </button>
    </div>
  );
};