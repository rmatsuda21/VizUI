// server/index.js
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get('/', async (req, res) => {
    res.send('hello world')
})

require("dotenv").config();





