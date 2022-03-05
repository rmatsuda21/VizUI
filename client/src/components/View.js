import '../stylesheets/view.css';
import React from 'react'
import { useParams } from 'react-router-dom';

import App from "./AppView"

import apis from "../api";

const { Component } = require("react");

function View(props) {
    const {id} = useParams()

    return (
        <div className="App">
            <header><h2>Preview</h2></header>
            <div id="preview"><App id={id}/></div>
        </div>
    );
}

export default View;
