import express from "express"
import cors from "cors"
import router from "./route/route.mjs"
import bodyParser from 'body-parser';

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use("/api/v1/hello-books", router)
app.use("*", (req, res) => res.status(404).json(
    {error: "not found"}
))
export default app

