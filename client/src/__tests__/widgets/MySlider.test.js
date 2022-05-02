import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { MySlider } from "../../widgets/components";

test("renders correctly", () => {
    render(<MySlider name={"Test"} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
});

test("works when dragged", () => {
    render(<MySlider text={"Test"} />);
    const label = screen.getByText("Test 0")

    const input = screen.getByTestId("slider")

    input.getBoundingClientRect = jest.fn(() => {
      return {
        bottom: 286.22918701171875,
        height: 28,
        left: 19.572917938232422,
        right: 583.0937919616699,
        top: 258.22918701171875,
        width: 563.5208740234375,
        x: 19.572917938232422,
        y: 258.22918701171875,
      }
    })

    expect(input).toBeInTheDocument()

    expect(label).toHaveTextContent("Test 0")
    await fireEvent.mouseDown(input, { clientX: 162, clientY: 302 })
    expect(label).toHaveTextContent(
      "Test 50"
    )
})