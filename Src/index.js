import connectDB from "../Src/db/index.js";
import app from './app.js'
import dotenv from "dotenv"
dotenv.config({ path: "../env" })

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log("Server running For Port:" + process.env.PORT || 4000)
        })
    })
    .catch((error) => {
        console.log("Mongodb Connection Faild" + error)
    })