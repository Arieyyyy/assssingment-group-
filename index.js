const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210082:password1234@cluster0.uhzytme.mongodb.net/?retryWrites=true&w=majority";

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
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }
  run().catch(console.dir);
app.use(express.json())
app.get('/', (req, res) => {
})

app.post('/register',(req,res)=>{
    const { username, password } = req.body;
    console.log(username, password);
    const hash = bcrypt.hashSync (password, 10);
   // client.db('assingment group').collection('users')
   // .insertOne ({"useername": username, "password":hash}); 
    res.send("register success")
})

app.post('/login',(req, res)=> {
    const { username, password } = req.body;
    console.log(username, password);
    
    if(bcrypt.compareSync(password, user.password)==true) {
        res.send('register succesfully')
    }
    else{
         res.send('register failed')
    }
    })


app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})

async function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
      return res.status(401).send('Unauthorized');
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'your-secret-key', function (err, decoded) {
      if (err) {
          return res.status(401).send('Unauthorized');
      }
      else {
          console.log(decoded);
          if (decoded.username != username) {
              return res.status(401).send('Again Unauthorized');
          }
      }
      next();
  });
}