// server/index.js
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

const dbo = require("./db/conn");

const dbCleanup = () => {
    dbo.cleanUpServer();
};

const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

var SOCKET;

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    dbo.connectToServer(() => {
        console.log("Success!");
    });
})

io.on("connection", (socket) => {
    console.log("User connected");
    SOCKET = socket
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    // dbo.connectToServer(() => {
    //     console.log("Success!");
    // });
});

// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
    const click = {clickTime: new Date()};
    console.log(click);
    console.log(db);
  
    db.collection('clicks').save(click, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('click added to db');
      res.sendStatus(400);
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

app.get('/test', async (req, res) => {
    console.log('DKWNAJD')
    SOCKET.emit('TEST')
})