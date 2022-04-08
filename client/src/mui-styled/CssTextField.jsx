import { withStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";

const CssTextField = withStyles({
        root: {
            "& .MuiInputBase-input": {
                color: "white",
            },
            "& .MuiInputLabel-root": {
                color: "white",
            },
            "& .MuiOutlinedInput-root": {
                "& fieldset": {
                    color: "white",
                    borderColor: "#3f51b5",
                },
                "&:hover fieldset": {
                    color: "white",
                    borderColor: "#3f51b5",
                },
            },
        },
    })(TextField);
    
export default CssTextField;