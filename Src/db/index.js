import mongoose from "mongoose";
import DBNAME from "../constants.js";

const connectDB = async () => {
    try {
        const connectionmongoose = process.env.Mongo_DB + DBNAME

        const connection = await mongoose.connect(connectionmongoose, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("MongoDB Connect For Database", connection.connection.host + ":dataBaseName:" + DBNAME)
    } catch (error) {
        console.log("MongoDB Connection faild")
    }
}

export default connectDB;