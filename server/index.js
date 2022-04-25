const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const PouchDB = require("pouchdb");
const apiRouter = require("./src/routes/api.route");

require("dotenv").config();
require("./src/config/cleanup.config");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const PORT = process.env.PORT || 3001;


io.on("connection", socket => {
    console.log("Socket connected")

    socket.on("widget", (update) => {
        const db = new PouchDB(`database/${update.appId}`);

        widget = {
            _id: update.name,
            data: update.data
        }

        db.get(update.name).then(function (doc) {

            widget._rev = doc._rev

            if (typeof update.data === "object" && "field" in update.data) {

                const rows = doc.data

                rows.forEach(r => {
                    if (r.id == update.data.row.id) {
                        r[update.data.field] = update.data.newValue
                    }
                });

                widget.data = rows
            }

            if (!Array.isArray(update.data)) db.put(widget)

        }).catch(function (err) {

            if (err.status == 404) {

                //console.log(widget)

                db.put(widget)
            }
            else console.log(err)

        });

        /*
        const updatedWidgets = update.widgets
        updatedWidgets[update.name] = widget.data
        console.log(updatedWidgets)
        socket.broadcast.to(update.appId).emit("change", updatedWidgets);
        */
    })

    socket.on("loadWidgets", appId => {
        // socket.join(appId)
        // console.log(io.sockets.clients(appId))

        const db = new PouchDB(`database/${appId}`)

        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            socket.emit("allWidgets", result.rows)
        }).catch(function (err) {
            console.log(err);
        });

        /* changes go undetected for some reason

        db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', function (change) {
            console.log(change)
            io.to(appId).emit("change", change);
        }).on('error', function (err) {
            console.log(err)
        });
        */
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

/*
function mockSliderVals() {

    db.allDocs({
        include_docs: true,
        attachments: true,
        startkey: 'horizontalSlider',
        endkey: 'horizontalSlider\ufff0'
    }).then(function (result) {

        sliders = result.rows

        console.log(sliders)

        sliders.forEach(s => {
            s.value = Math.floor(Math.random()*100) + 1
        })

        console.log(sliders)

        db.bulkDocs(sliders).then(function (result) {

            console.log(result)

            }).catch(function (err) {
            console.log(err);
            });

    }).catch(function (err) {
        console.log(err);
    });

}

setTimeout(mockSliderVals, 5000);
*/
