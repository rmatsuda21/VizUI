import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MyRadio } from "../../widgets/components";

test("renders correctly", () => {
    render(<MyRadio label={"Test"} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
});
