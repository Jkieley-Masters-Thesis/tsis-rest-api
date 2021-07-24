const express = require('express')
const { MongoClient } = require("mongodb");
const app = express()
app.use(express.json()) // for parsing application/json
const port = 3030

app.post('/', (req, res) => {
    const uri = process.env.MONGODB_CONNECTION_STR;
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    async function run() {
        try {
            let document = req.body;
            document.created = new Date();
            // Connect the client to the server
            await client.connect();
            // Establish and verify connection
            let result = await client.db("thesis").collection("trained_models").insertOne(document);
            res.json(result)
            console.log("Connected successfully to server");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run().catch(console.dir);
})
app.get('/', (req, res) => {
    let model = req.query.model;
    let query = {
        "key": model
    };
    let sort = [ ["_id", -1.0] ];

    const uri = process.env.MONGODB_CONNECTION_STR;
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    async function run() {
        try {
            let document = req.body;
            document.created = new Date();
            // Connect the client to the server
            await client.connect();
            // Establish and verify connection
            let result = await client.db("thesis").collection("trained_models").findOne(query,{
                sort: sort
            })
            res.json(result)
            console.log("Connected successfully to server");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    run().catch(console.dir);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})