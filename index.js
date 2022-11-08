const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());


// Database 

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ksaovkw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db("dochouse").collection("services");
        const reviewCollection = client.db("dochouse").collection("reviews");

        app.get('/home', async (req, res) => {
            const query = {};
            const services = await serviceCollection.find(query).limit(3).toArray();
            console.log(services);
            res.send(services);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const services = await serviceCollection.find(query).toArray();
            res.send(services);
        });

        app.get(`/services/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await serviceCollection.findOne(query);
            res.send(services);
        });


        // Post Your reviews

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });


        app.get('/reviews', async (req, res) => {
            console.log(req.query.serviceId)

            let query = {};
            if (req.query.serviceId) {
                query = { serviceId: req.query.serviceId };
            }
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews)
        })




    }
    finally {
        // await client.close();
    }
}
run().catch(error => console.log(error));










app.get('/', (req, res) => {
    res.send("Dochouse Server runnig")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})