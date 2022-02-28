import React from 'react'
import '../stylesheets/MyButton.css'

function MyButton(props) {
  return (
    <>
    <input type="button" value={props.label} />
    </>
  );
};

export default MyButton;