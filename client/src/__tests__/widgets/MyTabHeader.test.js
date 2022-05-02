import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MyTab, MyTabHeader } from "../../widgets/components";

test("renders correctly", () => {
    render(<MyTabHeader tabNames={["Test", "Test2"]} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test2")).toBeInTheDocument();
});
