import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MyTable } from "../../widgets/components";

test("renders correctly", () => {
    let columnDefs = [
        { field: "rowNames", headerName: "rowID", editable: false },
    ];
    columnDefs.push({
        field: "Test",
        headerName: "Test",
        editable: true,
    });
    columnDefs.push({
        field: "Test2",
        headerName: "Test2",
        editable: true,
    });
    render(<MyTable name={"Test"} columnDefs={columnDefs} rowData={[]} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
});
