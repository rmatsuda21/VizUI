import '../stylesheets/view.css';
import React from 'react'

import App from "./AppView"

import apis from "../api";

const { Component } = require("react");

class View extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

  render() {

    return (
        <div className="App">
            <header><h2>Preview</h2></header>
            <div id="preview"><App /></div>
        </div>
    );
  }
};

export default View;
