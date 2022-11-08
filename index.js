const express = require("express");
const app = express();
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// user law-firm
// password CaygxDFuDgTrQert




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b6qirvs.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const servicesCollection = client.db("law-firm").collection("services")


function run() {
    try {

    } catch (error) {

        console.log(error.name, error.message)

    }
}

run();


// services api with limit 
app.get("/services", async (req, res) => {
    try {
        const query = {}
        const cursor = servicesCollection.find(query)
        const services = await cursor.limit(3).toArray()
        res.send({
            success: true,
            message: "Successfully data loaded",
            data: services
        })

    } catch (error) {

        res.send({
            success: false,
            error: error.message
        })
    }
})

// create services api without limit 
app.get("/allServices", async (req, res) => {
    try {

        const query = {}
        const cursor = servicesCollection.find(query)
        const allServices = await cursor.toArray()
        res.send({
            success: true,
            message: "Successfully loaded",
            data: allServices
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})


app.get("/", (req, res) => {
    res.send("App is running")
})

app.listen(port, () => {
    console.log(`app running on the port ${port}`);
})