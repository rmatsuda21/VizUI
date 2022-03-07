const { MongoClient } = require("mongodb");
require("dotenv").config();
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;
let dbInstance;

module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (err || !db) {
                return callback(err);
            }

            dbConnection = db.db("Test");
            console.log("Successfully connected to MongoDB.");

            return callback();
        });
    },

    createCollection: async function (dbName, collectionName) {
        const db = await client.connect().catch((err) => {
            throw err;
        });

        if (!db) throw "Could not connect to database!";

        var dbo = db.db(dbName);
        try {
            const collection = await dbo.createCollection(collectionName);
            console.log("Collection created!");
        } catch (e) {
            throw e;
        } finally {
            db.close();
            await client.close();
        }
    },

    writeToCollection: async function (db_name, collection_name, docs) {
        const db = await client.connect().catch((err) => {
            throw err;
        });

        if (!db) throw "Could not connect to database!";

        const dbo = db.db(db_name);
        const collection = dbo.collection(collection_name);
        try {
            const options = { ordered: true };

            const result = await collection.insertMany(docs, options);

            console.log(`Successfully inserted ${result.insertedCount} docs`);

            db.close();
            await client.close();
        } catch (e) {
            throw e;
        } finally {
            db.close();
            await client.close();
        }
    },

    cleanUpServer: function () {
        client.close(() => {
            console.log("Client Closed!");
        });
    },

    getDb: function () {
        return dbConnection;
    },
};
