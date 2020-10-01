const express=require('express');
const mongodb=require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config()

const app=express()
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.koqo3.mongodb.net/ema-john?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology:true });
client.connect(err => {
  const productsCollection = client.db('ema-john').collection('products')
  const ordersCollection = client.db('ema-john').collection('orders')
  console.log('database successfully connected')

  app.post('/addProducts',(req,res)=>{
    const products=req.body;
    productsCollection.insertMany(products)
  })

  app.get('/products',(req,res)=>{
    productsCollection.find({})
    .toArray((error,documents)=>{
      res.send(documents);
    })
  })

  app.get('/product/:key',(req,res)=>{
    const productKey=req.params.key
    productsCollection.find({key:productKey})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.post('/someProducts',(req,res)=>{
    const keys=req.body
    productsCollection.find({key:{$in:keys}})
    .toArray((error,documents)=>{
      res.send(documents);
  
    })
  })
  
  app.post('/addOrder',(req,res)=>{
    const order=req.body
    ordersCollection.insertOne(order)
    .then(result=>{
      res.send('successfully placed')
      console.log(result)
    })
    .catch(err=>console.log(err))
  })

});

app.listen(5000,()=>console.log('app running on port:5000'))