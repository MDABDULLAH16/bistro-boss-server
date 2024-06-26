const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfkajtr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      
      const menuCollection = client.db('bistroDb').collection('menu')
      const reviewsCollection = client.db('bistroDb').collection('reviews')
      const cartsCollection = client.db('bistroDb').collection('carts')
      
      app.get('/menu', async (req, res) => {
          const results = await menuCollection.find().toArray()
          res.send(results)
      })
      app.get('/reviews', async (req, res) => {
          const results = await reviewsCollection.find().toArray()
          res.send(results)
      })
    // store a cart for oder
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const results = await cartsCollection.insertOne(cartItem)
      res.send(results)
    })
    // get added product 
    app.get('/carts', async (req, res) => {
      const email = req.query.email
      const query ={email: email}
      const results = await cartsCollection.find(query).toArray()
      res.send(results)
    })
//delete added product
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const results = await cartsCollection.deleteOne(query)
      res.send(results)
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Bistro Boss Is Running')
})
app.listen(port, () => {
    console.log(`Bistro boss is running on Port: ${port}`);
})