import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { MyButton } from "../../widgets/components";

it("renders correctly", () => {
    render(<MyButton text={"Test"}/>);
    expect(screen.getByText('Test')).toBeInTheDocument();
});