import app from "./server.mjs"
import mongodb from "mongodb"
import UsersDAO from "./dao/users.DAO.mjs"
import DashboardDAO from "./dao/dashboard.DAO.mjs"
import ProductsDAO from "./dao/products.DAO.mjs"
import CartDao from "./dao/cart.DAO.mjs"
import OrderDao from "./dao/order.DAO.mjs"
import dotenv from "dotenv"
dotenv.config()

const username = process.env.MONGO_USERNAME
const password = process.env.MONGO_PASSWORD
const port = process.env.PORT
const DB_CONN_STRING =  `mongodb+srv://${username}:${password}@cluster0.vc3qfp3.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = mongodb.MongoClient

mongoClient.connect(
    DB_CONN_STRING, 
    {
        maxPoolSize: 20,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
).catch(err => {
    console.error(err)
    process.exit(1)
}).then( async client => {
    await UsersDAO.injectDB(client)
    await DashboardDAO.injectDB(client)
    await ProductsDAO.injectDB(client)
    await CartDao.injectDB(client)
    await OrderDao.injectDB(client)
    app.listen(port, ()=>{
        console.log("Listening on port", port)
    })
}
)