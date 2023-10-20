const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcynqnr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {

  const brandsCollection = client.db("brandsDB").collection("brands");
  const productsCollection = client.db("productsDB").collection("products");

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // :::::::::  Brands Data ::::::::::

    app.post('/brands', async(req, res) =>{
      const brand = req.body;
      const result = await brandsCollection.insertOne(brand);
      res.send(result);
    })

    app.get('/brands', async(req, res) =>{
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/brands/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const brand = await brandsCollection.findOne(query);
      res.send(brand);
   })

    app.delete('/brands/:id', async(req, res) =>{
      const id = req.params.id;
      console.log("delete this", id);
      const query = {_id: new ObjectId(id) };
      const result = await brandsCollection.deleteOne(query);
      res.send(result);

    })
    // :::::::::  Products Data ::::::::::

    app.post('/products', async(req, res) =>{
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    })

    // app.get('/products', async(req, res) =>{
    //   const cursor = productsCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })



    
    app.get('/products/:brandName', async(req, res) =>{
      const brandName = req.params.brandName;
      const query = {"brandName": brandName};
      console.log("dekhi", brandName)
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      
    })

   
    app.get('/products/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const product = await productsCollection.findOne(query);
      res.send(product);
    })

    
    app.delete('/products/:id', async(req, res) =>{
      const id = req.params.id;
      console.log("delete this", id);
      const query = {_id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);

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




app.get("/", (req, res) =>{
    res.send("Brand shop server is running.")
})

app.listen(port, () =>{
    console.log(`Brand shop server is running on port ${port}`)
})