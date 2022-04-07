const PouchDB = require("pouchdb");

// Ensure that database folder exists
const fs = require("fs");
if (!fs.existsSync("database")) fs.mkdirSync("database", { recursive: true });

let db;

module.exports = {
    /**
     * Connect to specified database.
     *
     * @param {string} dbName The name of the database.
     * @returns {Promise} Response from server.
     * @throws "Not connected to database"
     */
    connectToDB: async function (dbName) {
        if (db) await db.close();

        db = new PouchDB(`database/${dbName}`, { skip_setup: true });
        return Promise.resolve("Connected to DB");
    },

    /**
     * Close currently opened db.
     *
     * @returns {Promise} Response from server.
     * @throws "Not connected to database"
     */
    closeDB: async function () {
        if (!db) throw "Not connected to database!";

        await db.close();
        db = null;
        return Promise.resolve("Closed DB");
    },

    /**
     * Create collection with specific name
     *
     * @param {string} collectionName The name of collection.
     * @returns {Promise} Response from db creation.
     */
    createCollection: async function (collectionName) {
        if (!db) throw "Not connected to database!";

        try {
            const res = await db.put({
                _id: collectionName,
                name: collectionName,
                data: [],
            });

            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    /**
     * Writes data to specified collection
     *
     * @param {string} collectionName The name of collection.
     * @param {any} data The data to write.
     * @param {boolean} createIfNotFound Should we create collection if not found?
     * @return {Promise} Response from db write.
     */
    writeToCollection: async function (collectionName, data, createIfNotFound = false) {
        if (!db) throw "Not connected to database!";

        // Does collection exist?
        // If not, should we create it?
        let collection;
        try {
            collection = await db.get(collectionName);
        } catch (e) {
            if (!createIfNotFound && e.name === "not_found") {
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
                data: [...collection.data, { created: timestamp, data: data }],
            });

            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    /**
     * Query collection from database.
     *
     * @param {string} collectionName The name of collection.
     * @return {Promise} Response from query.
     */
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
