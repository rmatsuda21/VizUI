const express = require("express");
const router = express.Router();
const db = require("../utils/db");

const { dirname } = require("path");
const appDir = dirname(require.main.filename);

// Uploading UI File
const UPLOAD_DESTINATION = appDir + "/uploads/UI";
const JSON_DESTINATION = appDir + "/uploads/JSON";

// Ensure that upload dest/json dest exists
const fs = require("fs");

if (!fs.existsSync(UPLOAD_DESTINATION))
    fs.mkdirSync(UPLOAD_DESTINATION, { recursive: true });

if (!fs.existsSync(JSON_DESTINATION))
    fs.mkdirSync(JSON_DESTINATION, { recursive: true });

const multer = require("multer");
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

const { parseUIFile } = require("../helpers/parser");
const { response } = require("express");

router.post("/convert", upload.single("uiFile"), async (req, res) => {
    let filename = req.file.filename,
        path = req.file.path;
    parseUIFile(path, filename, JSON_DESTINATION);

    await db.connectToDB("applications");
    await db.appendToCollection(
        "applications",
        {
            filename,
            modified: new Date().toISOString(),
            name: req.body.appName,
        },
        true
    );
    await db.closeDB();

    res.redirect(`http://localhost:3000/view/${filename}`);
});

router.post("/update/:id", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        fs.writeFileSync(
            `${JSON_DESTINATION}/${req.params.id}.json`,
            JSON.stringify(data)
        );

        res.status(200).send("Wrote!");
    } catch (e) {
        console.log("oh no")
        res.status(400).send(e);
    }
});

router.get("/get-json/:id", async (req, res) => {
    const data = require(JSON_DESTINATION + `/${req.params.id}.json`);

    await db.connectToDB(req.params.id);
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(data));
});

router.get("/db/write/:data", async (req, res) => {
    try {
        await db.appendToCollection("test", req.params.data, {
            createIfNotExist: true,
        });
        const data = await db.queryCollection("test");
        console.log("DATA", data);

        res.status(200).send("Wrote!");
    } catch (e) {
        console.log("ERROR");
        console.log(e);
        res.status(400).send(e);
    }
});

router.delete("/db/delete/:filename", async (req, res) => {
    const filename = req.params.filename;
    try {
        const removeRes = await db.removeFromCollection(
            "applications",
            filename
        );
        try {
            fs.unlinkSync(appDir + "/uploads/JSON/" + filename + ".json");
            fs.unlinkSync(appDir + "/uploads/UI/" + filename);
            fs.rmSync(appDir + "/database/" + filename, {
                recursive: true,
                force: true,
            });
        } catch (e) {
            console.log(e);
        }
        res.status(200).send(removeRes);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/db/query/:dbName/:collectionName", async (req, res) => {
    try {
        await db.connectToDB(req.params.dbName);
        const data = await db.queryCollection(req.params.collectionName);
        res.status(200).json(data);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/db/query/:collectionName", async (req, res) => {
    try {
        const data = await db.queryCollection(req.params.collectionName);
        res.status(200).json(data);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/db/connect/:dbName", async (req, res) => {
    try {
        const data = await db.connectToDB(req.params.dbName);
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/test", async (req, res) => {
    try {
        await db.connectToDB("testDB");
        await db.appendToCollection("DWALKDMLWKAMDLK", 123, {
            createIfNotFound: true,
        });
        const data = await db.queryCollection("DWALKDMLWKAMDLK");
        await db.closeDB();
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
