const db = require("../utils/db");

// Clean up
const dbCleanup = async () => {
    try {
        await db.closeDB();
    } catch (e) {
        console.log(e);
    }
    process.exit();
};

//do something when app is closing
process.on("exit", dbCleanup);

//catches ctrl+c event
process.on("SIGINT", dbCleanup);

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", dbCleanup);
process.on("SIGUSR2", dbCleanup);

//catches uncaught exceptions
process.on("uncaughtException", dbCleanup);
