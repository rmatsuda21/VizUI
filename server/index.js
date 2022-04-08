const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3001;

const PouchDB = require("pouchdb");
const apiRouter = require("./src/routes/api.route");

require("dotenv").config();
require("./src/config/cleanup.config");

const db = new PouchDB('database/test')

db.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function(change) {
        io.sockets.emit("change", change)
  }) 

io.on("connection", socket => {
    console.log("Socket connected")

    socket.on("update", update => {
        update._id = new Date().toISOString()

        db.put(update, (err, result) => {
            if (err) console.log(err)
            else console.log(result)
        })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    }); 
});



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use("/api", apiRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });

    return;
});

app.get("/api/get-json/:id", (req, res) => {
    const data = require(JSON_DESTINATION + `/${req.params.id}.json`);

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(data));
});

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});