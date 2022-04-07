import React, { Component } from "react";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function RadioButtons(props) {
  // let hi = State();
  // const [selectedValue, handleChange] = React.useState("a");
  const RadioContext = React.createContext({
    values: {},
    handleChange: () => {}
  });

  const [values, setValues] = React.useState({ "gender": "female" });

  const handleChange = (group, value) => {
    console.log(value);
    console.log(group);
    let cur_values = values;
    console.log(cur_values)
    cur_values[group] = value;
    setValues(cur_values);
    console.log(values);
  };

  // State also contains the updater function so it will
  // be passed down into the context provider
  const group_value = {
    values: values,
    handleChange: handleChange
  };
  return (
    <div>
      {/* <FormControlLabel
        value="female"
        control={<Radio />}
        onChange={handleChange}
        label="Female"
      />
      <FormControlLabel
        value="female"
        control={<Radio />}
        label="Male"
        onChange={handleChange}
      /> */}

      <RadioContext.Provider value={group_value}>
        <RadioContext.Consumer>
          {({ values, handleChange }) => (
            <>
              {values["gender"]}
              <Radio
                checked={values["gender"] === "female"}
                onChange={() => handleChange("gender", "female")}
                value="female"
                id="female"
                name="radio-button"
                label="penis"
                inputProps={{ "aria-label": "female" }}
              />
              <label for="female">Female</label>

              <Radio
                checked={values["gender"] === "male"}
                onChange={() => handleChange("gender", "male")}
                value="male"
                id="male"
                name="radio-buttons"
                inputProps={{ "aria-label": "B" }}
              />
              <label for="male">Male</label>
            </>
            // <button
            //   onClick={handleChange}
            //   style={{backgroundColor: theme.background}}>
            //   Toggle Theme
            // </button>
          )}
        </RadioContext.Consumer>
      </RadioContext.Provider>
    </div>
  );
}
