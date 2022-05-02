import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MyDialKnob } from "../../widgets/components";

test("renders correctly", () => {
    render(<MyDialKnob name={"Test"} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
});
