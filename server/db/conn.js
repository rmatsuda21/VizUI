const { MongoClient } = require("mongodb");
require("dotenv").config();
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

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

  cleanUpServer: function () {
      client.close(() => {
          console.log('Client Closed!')
      });
  },

  getDb: function () {
    return dbConnection;
  },
};