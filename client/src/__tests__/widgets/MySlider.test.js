import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MySlider } from "../../widgets/components";

test("renders correctly", () => {
    render(<MySlider name={"Test"} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
});
