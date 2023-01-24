const express = require("express");
const app = express();
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b6qirvs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const servicesCollection = client.db("law-firm").collection("services")
const reviewCollection = client.db("law-firm").collection("review")
const profileCollection = client.db("law-firm").collection("profile")
const commentCollection = client.db("law-firm").collection("comments")


function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized access" })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "Forbidden  Access" })
        }
        req.decoded = decoded
        next()
    })

}

async function run() {
    try {

    } catch (error) {

        console.log(error.name, error.message)

    }
}

run();

// jwt token post api
app.post("/jwt", (req, res) => {
    const user = req.body
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    res.send({ token })
})


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

// create api to find a specific service details
app.get("/allServices/:id", async (req, res) => {
    try {

        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const service = await servicesCollection.findOne(query)
        res.send({
            success: true,
            message: "Successfully loaded",
            data: service
        })

    } catch (error) {

        res.send({
            success: false,
            error: error.message
        })

    }
})

// create add service api
app.post("/service", async (req, res) => {
    try {

        const query = req.body
        const service = await servicesCollection.insertOne(query)
        res.send({
            success: true,
            message: "successfully added service",
            data: service
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// Create review
app.post("/review", async (req, res) => {
    try {

        const query = req.body;
        const review = await reviewCollection.insertOne(query)
        res.send({
            success: true,
            message: "successfully added review",
            data: review
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// get specific reviews at the specific service
app.get("/review/:id", async (req, res) => {
    try {

        const id = req.params.id
        const query = { productId: id }
        const cursor = reviewCollection.find(query)
        const result = await cursor.sort({ _id: - 1 }).toArray()
        res.send({
            success: true,
            message: "Successfully loaded",
            data: result
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// get specific reviews at the specific email or user 
app.get("/review", verifyJwt, async (req, res) => {
    try {

        const decoded = req.decoded
        if (decoded.email !== req.query.email) {
            res.status(401).send({ message: "Unauthorized access" })
        }

        let query = {}
        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewCollection.find(query)
        const review = await cursor.toArray()
        res.send({
            success: true,
            message: "Successfully loaded",
            data: review
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// create delete review api 
app.delete("/review/:id", async (req, res) => {
    try {

        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const result = await reviewCollection.deleteOne(query)
        res.send(result)

    } catch (error) {
        res.send({
            error: error.message
        })
    }
})

// create api for updating review 
app.patch("/review/:id", async (req, res) => {
    try {

        const id = req.params.id
        let review = req.body.review
        const query = { _id: ObjectId(id) }
        const updatedDoc = {
            $set: {
                review: review
            }
        }
        const result = await reviewCollection.updateOne(query, updatedDoc)
        res.send(result)

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

// create get api for getting all team profile 
app.get("/profile", async (req, res) => {
    const query = {}
    const result = await profileCollection.find(query).toArray()
    res.send(result)
})

// create get api for getting specific user profile
app.get("/profile_details/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) }
    const result = await profileCollection.findOne(query)
    res.send(result)
})

// post method for posting comment
app.post("/comment", async (req, res) => {
    const comment = req.body
    const result = await commentCollection.insertOne(comment)
    res.send(result)
})

// get api for getting specific profile comments 
app.get("/comments/:id", async (req, res) => {
    const id = req.params.id;
    const query = { profileId: id }
    const result = await commentCollection.find(query).toArray()
    res.send(result)
})


app.get("/", (req, res) => {
    res.send("App is running")
})

app.listen(port, () => {
    console.log(`app running on the port ${port}`);
})