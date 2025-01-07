const express = require('express');
const app = express();
const port = process.env.PORT || 1200;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210082:password1234@cluster0.uhzytme.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Password validation function
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the app if connection fails
  }
}
connectToDatabase().catch(console.error);

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await client.db("AttendanceManagementSystem").collection("User").findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid username or password');
    }

    const token = generateToken(user);
    res.send({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create Student route
app.post('/Admin/createStudent', verifyToken, async (req, res) => {
  const { username, password, role, student_id, email } = req.body;

  if (!password || !isValidPassword(password)) {
    return res.status(400).send('Invalid password. Must contain at least one letter, one number, one special character, and be at least 8 characters long.');
  }

  try {
    const existingUser = await client.db("AttendanceManagementSystem").collection("User").findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await client.db("AttendanceManagementSystem").collection("User").insertOne({
      username,
      password: hashedPassword,
      role,
      student_id,
      email
    });

    res.status(201).send('Student created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create Staff route
app.post('/Admin/createStaff', verifyToken, async (req, res) => {
  const { username, password, role, email, staff_id } = req.body;

  if (!password || !isValidPassword(password)) {
    return res.status(400).send('Invalid password. Must contain at least one letter, one number, one special character, and be at least 8 characters long.');
  }

  try {
    const existingStaff = await client.db("AttendanceManagementSystem").collection("User").findOne({ username });
    if (existingStaff) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    await client.db("AttendanceManagementSystem").collection("User").insertOne({
      username,
      password: hashedPassword,
      role,
      email,
      staff_id
    });

    res.status(201).send('Staff created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// JWT Token generation
function generateToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role },
    'your-secret-key',
    { expiresIn: '365d' }
  );
}

// Middleware to verify the token
function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send('Unauthorized');
  }

  const token = header.split(' ')[1];
  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err || decoded.role !== 'Admin') {
      return res.status(401).send('Unauthorized');
    }
    next();
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// What is the purpose of the following code snippet?   
