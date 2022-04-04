const PouchDB = require("pouchdb");

// Ensure that database folder exists
const fs = require("fs");
if (!fs.existsSync("database")) fs.mkdirSync("database", { recursive: true });

let db;

module.exports = {
    connectToDB: async function (dbName) {
        if (db) await db.close();

        db = new PouchDB(`database/${dbName}`, { skip_setup: true });
        return Promise.resolve("Connected to DB");
    },

    closeDB: async function (dbName) {
        if (!db) throw "Not connected to database!";

        await db.close();
        db = null;
        return Promise.resolve("Closed DB");
    },

    createCollection: async function (collectionName) {
        if (!db) throw "Not connected to database!";

        try {
            await db.put({
                _id: collectionName,
                name: collectionName,
                data: [],
            });

            return Promise.resolve(1);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    writeToCollection: async function (collectionName, data, options) {
        if (!db) throw "Not connected to database!";

        // Set options
        const { setDefaults } = require("../helpers/helpers");
        const defaults = {
            createIfNotFound: false,
        };
        options = setDefaults(options, defaults);

        // Does collection exist?
        // If not, should we create it?
        let collection;
        try {
            collection = await db.get(collectionName);
        } catch (e) {
            if (!options.createIfNotFound && e.name === "not_found") {
                return Promise.reject(e);
            }

            await this.createCollection(collectionName);
            collection = await db.get(collectionName);
        }

        // Write data
        try {
            const timestamp = new Date().toISOString();
            var res = await db.put({
                _id: collectionName,
                _rev: collection._rev,
                data: [...collection.data, { time: timestamp, data: data }],
            });

            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    queryCollection: async function (collectionName) {
        if (!db) throw "Not connected to database!";

        try {
            const res = await db.get(collectionName);
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    getDb: function () {
        return db;
    },
};
