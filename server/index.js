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

io.on("connection", socket => {
    console.log("Socket connected")

    socket.on("widget", update => {
        const db = new PouchDB(`database/${update.appId}`)

        widget = {
            _id: update.name,
            data: update.data
        }

        db.get(update.name).then(function (doc) {

            widget._rev = doc._rev

            if (typeof update.data === 'object') {

                let rows = doc.data
                let newRow = true

                rows.forEach(r => {
                    if (r.id == update.data.row.id) {
                        r[update.data.field] = update.data.newValue
                        newRow = false
                    }
                });

                if (newRow) rows.append(update.data.row)
                widget.data = rows
            }

            console.log(widget)
            db.put(widget)

        }).catch(function (err) {

            if (err.status == 404) {

                if (typeof update.data === 'object') {
                    newRow = update.data.row
                    newRow[update.data.field] = update.data.newValue
                    widget.data = [newRow]
                } 

                db.put(widget)
            } 
            else console.log(err)

        });
    })

    socket.on("loadWidgets", appId => {
        const db = new PouchDB(`database/${appId}`)

        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            console.log(result)
            socket.emit("allWidgets", result.rows)
        }).catch(function (err) {
            console.log(err);
        });
    })
    
    // socket.on("updateDialValue", value => console.log(value))
    // socket.on("updateSliderValue", value => console.log(value))

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