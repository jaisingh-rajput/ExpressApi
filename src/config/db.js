const {MongoClient, ServerApiVersion} = require("mongodb");
require("dotenv").config();
let client;
let db;

const connectDB = async () => {
    if (!client) {
        try {
            client = new MongoClient(process.env.MONGOURI, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
            });

            await client.connect();
            db = client.db("ExpressApi"); // Set database instance
            console.log("MongoDB Connected to Database: expressApi");
        } catch (error) {
            console.error("MongoDB Connection Error:", error);
            process.exit(1);
        }
    }
    return db;
};

module.exports = {connectDB, getDB: () => db};
