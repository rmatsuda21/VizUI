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

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    // dbo.connectToServer(() => {
    //     console.log("Success!");
    // });
})  

io.on("connection", (socket) => {
    console.log("User connected");
    SOCKET = socket;

    socket.on('date', () => {
        console.log('GOT DATE')
        socket.emit('date', new Date());
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
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
// add a document to the DB collection recording the click event
app.post('/changed', (req, res) => {
    const position = {PosChangeTime: new Date()};
    console.log(position);
    console.log(db);
  
    db.collection('SliderChanges').save(position, (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('slider position change added to db');
      res.sendStatus(400);
    });
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

app.use(
    express.urlencoded({
        extended: true,
    })
);

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

app.get("/test", (req, res) => {
    console.log("DKWNAJD");
    SOCKET.emit("TEST");
});

app.get("/testdb/:dbname?", async (req, res) => {
    try {
        await dbo.createCollection(
            req.params.dbname || "DEFROUTEHEHEXD",
            "JUSTATESTMAN"
        );
        console.log("GOOD");
        res.send("GOOD");
    } catch (e) {
        console.log(e);
        res.send("BAD");
    }
});

app.get("/dbwrite/:db_name/:collection_name", async (req, res) => {
    try {
        await dbo.writeToCollection(
            req.params.db_name,
            req.params.collection_name,
            [{ name: "test" }]
        );
        console.log("GOOD");
        res.send("GOOD");
    } catch (e) {
        console.log(e);
        res.send("BAD");
    }
});

// Uploading UI File
const UPLOAD_DESTINATION = "./uploads/UI";
const JSON_DESTINATION = "./uploads/JSON";

const multer = require("multer");
const { parseUIFile } = require("./parser");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DESTINATION);
    },
    filename: function (req, file, cb) {
        const ID = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, ID);
    },
});
const upload = multer({ storage: storage });

app.post("/api/convert", upload.single("uiFile"), (req, res) => {
    let filename = req.file.filename,
        path = req.file.path;
    parseUIFile(path, filename, JSON_DESTINATION);

    console.log(filename);

    res.redirect(`/view/${filename}`);
});

app.get("/api/get-json/:id", (req, res) => {
    const data = require(JSON_DESTINATION + `/${req.params.id}.json`);

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(data));
});
