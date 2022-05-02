import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MyButton } from "../../widgets/components";

test("renders correctly", () => {
    render(<MyButton text={"Test"} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
});
