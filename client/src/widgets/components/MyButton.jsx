import React from 'react'
import '../stylesheets/MyButton.css'
import React, { useState }  from 'react'

function MyButton(props) {
  var [count, SetCount] = useState();

  const countUpdate=(event)=>{ // Dealing with name field changes to update our state
    setCount(event.target.value)
  }

  function PostRequest(props) {
       
      fetch('/clicked', {method: 'POST'})
        .then(function(response) {
          if(response.ok) {
            console.log('Click was recorded');
            return;
          }
          throw new Error('Request failed.');
        })
        .catch(function(error) {
          console.log(error);
      });


  }
  return (
    <>
    {/* onclick is a listener */}
    <input type="button" onClick={() => {
      countUpdate();
      PostRequest();
    }} value={props.label} />
    
    </>
  );
};

export default MyButton;