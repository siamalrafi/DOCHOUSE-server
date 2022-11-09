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
            res.send(services);
        })


        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);

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


        // get a single service review
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.serviceId) {
                query = { serviceId: req.query.serviceId };
            }
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews)
        });

        // get your reviews from this api
        app.get('/myreviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email };
            }
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews)
        });


        app.patch('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const rating = req.body.rating;
            const massage = req.body.massage;
            const query = { _id: ObjectId(id) };
            const updatedReview = {
                $set: {
                    rating: rating,
                    massage: massage
                }
            };
            const result = await reviewCollection.updateOne(query, updatedReview);
            console.log(result);
            res.send(result)

        });
        // gititiititit


        app.delete('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
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