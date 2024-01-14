const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

app.use(express.json())

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await client.db("AttendanceManagementSystem").collection("User").findOne({ "username": username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid username or password');
    }

    if (user) {
      const apaapaboleh = await generateToken(user);

      res.send('Login successfully \n' + apaapaboleh);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Admin/AddStudent', verifyToken, async (req, res) => {
  const { username, password, role, student_id, email } = req.body;

  try {
    const existingUser = await client.db("AttendanceManagementSystem").collection("User").findOne({ "username": username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await client.db("AttendanceManagementSystem").collection("User").insertOne({
      username: username,
      password: hashedPassword,
      role: role,
      student_id: student_id,
      email: email

    })

    res.send('Registration successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Students/RecordAttendance', (req, res) => {
  const { student_id, date, status } = req.body;
  try {
    RecordAttendance(student_id, date, status);
    res.status(201).send("Attendance recorded successfully");
  } catch (error) {

    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/students/viewDetails', async (req, res) => {
  const { student_id } = req.body;

  try {
    const details = await viewDetails(student_id);
    console.log(details);
    return res.status(201).send("Successful");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

async function viewDetails(student_id) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('User');

    const user = await collection.find({ student_id: student_id }).toArray();
    return user;
  }
  catch (error) {
    console.error("Error creating user:", error);
  }
}

async function RecordAttendance(student_id, date, status) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('Attendances');

    const user = {
      student_id: student_id,
      date: date,
      status: status,
    };

    await collection.insertOne(user);
    console.log("User created successfully");
  }
  catch (error) {
    console.error("Error creating user:", error);
  }
}

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
      if (decoded.role != 'Admin') {
        return res.status(401).send('Again Unauthorized');
      }
    }
    next();
  });
}

async function generateToken(user) {
  const token = jwt.sign({ 
    username: user.username,
    role: user.role,
  },
   'your-secret-key', 
   { expiresIn: '1h' });
  return token;
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})