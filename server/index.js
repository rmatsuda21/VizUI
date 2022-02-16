// server/index.js
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

const dbo = require("./db/conn");
const cors = require("cors");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    dbo.connectToServer(() => {
        console.log("Success!");
    });
});

app.get("/", async (req, res) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("Test")
        .find({})
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
});
