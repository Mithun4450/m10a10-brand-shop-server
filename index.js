const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion,  ObjectId } = require('mongodb');
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
  const cartsCollection = client.db("cartsDB").collection("carts");

  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

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

    app.get('/products', async(req, res) =>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    
    
    app.get('/products/brandWise/:brandName', async(req, res) =>{
      const brandName = req.params.brandName;
      const query = {"brandName": brandName};
      // console.log("dekhi", brandName)
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      
    })

    app.get('/products/productWise/:id', async(req, res) =>{
      const id =  req.params.id;
      const query = {_id: new ObjectId(id)};
      console.log(query)
      const product = await productsCollection.findOne(query);
      res.send(product);

    })

    app.put('/products/productWise/:id', async(req, res) =>{
      const id = req.params.id;
      const product = req.body;
      console.log(id, product);
      const filter = {_id: new ObjectId(id) };
      const options = {upsert: true};
      const updatedProduct = {
       $set : {
         name: product.name,
         photo: product.photo,
         brandName: product.brandName,
         type: product.type,
         price: product.price,
         description: product.description,
         rating: product.rating,
         
       }
      };
      const result = await productsCollection.updateOne(filter, updatedProduct, options);
      res.send(result);
   })

   app.get('/products/productDetails/:id', async(req, res) =>{
    const id =  req.params.id;
    const query = {_id: new ObjectId(id)};
    console.log(query)
    const product = await productsCollection.findOne(query);
    res.send(product);

  })


   // :::::::::  Carts Data ::::::::::

   app.post('/carts', async(req, res) =>{
    const cart = req.body;
    const result = await cartsCollection.insertOne(cart);
    res.send(result);
  })

  app.get('/carts', async(req, res) =>{
    const cursor = cartsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  app.get('/carts/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const cart = await cartsCollection.findOne(query);
    res.send(cart);
 })

  app.delete('/carts/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query);
    res.send(result);

  })

   

    

   
   




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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