import "../stylesheets/MyButton.css";
import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

function MyButton(props) {
    const [count, setCount] = useState(0);

    const countUpdate = () => {
        // Dealing with name field changes to update our state
        setCount(count + 1);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
            {/* onclick is a listener */}
            <Button
                aria-label={props.label}
                value={props.value}
                variant={props.variant}
                size={props.size} // small, medium, or large
                disabled={props.disable}
                disableElevation={props.disableElevation}
                sx={{
                    ...props.sx,
                    bgcolor: "primary.main",
                    "&:hover": { backgroundColor: "primary.light" },
                }}
                onClick={() => {
                    countUpdate();
                    if (props.tooltip === "confetti")
                        props.confetti.addConfetti({ confettiNumber: 30 });
                    // PostRequest();
                }}
            >
                {props.text}
            </Button>
            {props.tooltip === "confetti" ? (
                <></>
            ) : (
                <Typography variant="h6">{count}</Typography>
            )}
        </Box>
    );
}

export default MyButton;
