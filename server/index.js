const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3001;

const db = require("./src/utils/db");
const apiRouter = require("./src/routes/api.route");

require("dotenv").config();
require("./src/config/cleanup.config");

io.on("connection", (socket) => {
    // console.log("User connected");
    SOCKET = socket;

    socket.on("date", () => {
        console.log("GOT DATE");
        socket.emit("date", new Date());
    });

    // socket.on("updateDialValue", value => {
    //     console.log('server value: ' + value);
    // });
    
    socket.on("updateDialValue", value => console.log(value))

    socket.on("disconnect", () => {
        // console.log("User disconnected");
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

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
