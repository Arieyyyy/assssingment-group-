const express = require('express')
const app = express()
const port = process.env.PORT || 1200;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const rate = require('express-rate-limit');

const limiter = rate({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later'
});

app.use(limiter);
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

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

async function generateToken(user) {
  const token = jwt.sign({
    username: user.username,
    role: user.role,
    student_id: user.student_id,
    staff_id: user.staff_id,
  },
    'okayyy',
    { expiresIn: '365d' });
  return token;
}

const verifyTokenAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
  
  if (!token) {
    return res.status(401).send('Unauthorized - No token provided');
  }

  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, 'okayyy');
    console.log("Decoded token:", decoded); // Log decoded token to ensure staff_id is present

    if (decoded.role !== 'Admin') {
      return res.status(403).send('Access denied: Insufficient role');
    }

    req.user = decoded;  // Attach decoded token to the request object (req.user)
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).send('Invalid token');
  }
};

const verifyTokenAndRole = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the header
  
  if (!token) {
    return res.status(401).send('Unauthorized - No token provided');
  }

  try {
    const decoded = jwt.verify(token, 'okayyy'); // Verify the token using the same secret key
    console.log("Decoded token:", decoded); // Log decoded token to see its contents

    if (decoded.role !== 'student') {
      return res.status(403).send('Access denied: Insufficient role');
    }

    req.user = decoded; // Store the decoded token in the request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).send('Invalid token');
  }
};

// Role-based access control middleware
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied: Insufficient role');
    }
    next();
  };
};

async function verifyTokenStaff(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    return res.status(401).send('Unauthorized');
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'okayyy', function (err, decoded) {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    else {
      console.log(decoded);
      if (decoded.role != 'staff') {
        return res.status(401).send('Again Unauthorized');
      }
    }
    req.user = decoded;
    next();
  });
}

async function verifyTokenAdminStaff(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    return res.status(401).send('Unauthorized');
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'okayyy', function (err, decoded) {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    else {
      console.log(decoded);
      if (decoded.role != 'staff' && decoded.role != 'Admin') {
        return res.status(401).send('Again Unauthorized');
      }
    }
    req.user = decoded;
    next();
  });
}

async function verifyTokenStudent(req, res, next) {
  let header = req.headers.authorization;
  if (!header) {
    return res.status(401).send('Unauthorized');
  }

  let token = header.split(' ')[1];

  jwt.verify(token, 'okayyy', function (err, decoded) {
    if (err) {
      return res.status(401).send('Unauthorized');
    }
    else {
      console.log(decoded);
      if (decoded.role != 'student') {
        return res.status(401).send('Again Unauthorized');
      }
    }
    req.user = decoded;
    next();
  });
}

async function viewDetailss(student_id) {
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

async function viewDetails(staff_id) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('User');

    const user = await collection.find({ staff_id: staff_id }).toArray();

    if (!user) {
      return res.status(404).send('User not found');
    }

    return user;
  }
  catch (error) {
    console.error("Error creating user:", error);
  }
}

async function RecordAttendance(student_id, date, status, time) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('Attendances');

    const user = {
      student_id: student_id,
      date: date,
      status: status,
      time: time
    };

    await collection.insertOne(user);
    console.log("User created successfully");
  }
  catch (error) {
    console.error("Error creating user:", error);
  }
}

async function createSubject(name, code, faculty, programme, credit) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('Subject');

    // Create a user object
    const subject = {
      name: name,
      code: code,
      faculty: faculty,
      program: programme,
      credit: credit
    };
    // Insert the user object into the collection
    await collection.insertOne(subject);

    console.log("Subject created successfully");
  } catch (error) {
    console.error("Error creating subject:", error);
  }
}

async function viewStudentList() {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('User');

    // Find the user by username
    const user = await collection.find({ role: { $eq: "student" } }).toArray();

    return user;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
}

async function createStaff(username, password, role, email, staff_id) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('User');

    // Check if the staff member already exists
    const existingStaff = await collection.findOne({ username: username });

    if (!existingStaff) {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new staff member
      const user = {
        username: username,
        password: hashedPassword,
        role: role,
        email: email,
        staff_id: staff_id,
      };

      // Insert the new staff member into the 'User' collection
      await collection.insertOne(user);
      console.log("User created successfully");

      // Return the created user data without the password
      delete user.password;
      return user;
    } else {
      console.log("Staff member with the same username already exists");
      throw new Error("Staff member with the same username already exists");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

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

// app.post('/user', async (req, res) => {
//   const { username, password, role, email, staff_id } = req.body; // Removed student_id

//   try {
//     // Check if the username already exists
//     const existingUser = await client
//       .db("AttendanceManagementSystem")
//       .collection("User")
//       .findOne({ username: username });

//     if (existingUser) {
//       return res.status(400).send('Username already exists');
//     }

//     // Hash the password for security
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Insert the new user into the database
//     await client.db("AttendanceManagementSystem").collection("User").insertOne({
//       username: username,
//       password: hashedPassword,
//       role: role,
//       staff_id: staff_id, // Only keeping staff_id
//       email: email
//     });

//     res.status(201).send('User created successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while creating the user');
//   }
// });

app.post('/Admin/createStudent', verifyTokenAdmin, async (req, res) => {
  const { username, password, role, student_id, email } = req.body;

  try {
    const existingUser = await client.db("AttendanceManagementSystem").collection("User").findOne({ "username": username });

    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    if(!password || !isValidPassword(password)) {
      return res.status(400).send('Invalid password. Password must contain at least one letter, one number, one special character (@$!%*?&), and be at least 8 characters long.');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await client.db("AttendanceManagementSystem").collection("User").insertOne({
      username: username,
      password: hashedPassword,
      role: role,
      student_id: student_id,
      email: email
    })

    res.send('Registration successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Admin/createStaff', verifyTokenAdmin, async (req, res) => {
  const { username, password, role, email, staff_id } = req.body;

  try {

    // Check if the password is valid
  if (!password || !isValidPassword(password)) {
    return res.status(400).send('Invalid password. Password must contain at least one letter, one number, one special character (@$!%*?&), and be at least 8 characters long.');
  }

    // Check if the username already exists
    const existingUser = await client.db("AttendanceManagementSystem").collection("User").findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }
 
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the new staff into the database
    await client.db("AttendanceManagementSystem").collection("User").insertOne({
      username,
      password: hashedPassword,
      role,
      email,
      staff_id,
    });

    res.status(201).send('Staff created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Admin/createFaculty', verifyTokenAdmin, verifyRole(['Admin', 'staff']), async (req, res) => {
  const { name, code, programs, students } = req.body;
  
  try {
    await client.db("AttendanceManagementSystem").collection("Faculties").insertOne({
      name: name,
      code: code,
      programs: programs,
      students: students,
    });

    res.send('Faculty created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Admin/createPrograms', verifyTokenAdmin, async (req, res) => {
  const { name, code, faculty, subject, students } = req.body;
  try {

    await client.db("AttendanceManagementSystem").collection("Programs").insertOne({
      name: name,
      code: code,
      faculty: faculty,
      subject: subject,
      students: students,
    })

    res.send('Program created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Admin/create-subject', verifyTokenAdmin, async (req, res) => {
  const { name, code, faculty, program, credit } = req.body;

  try {
    const result = await createSubject(name, code, faculty, program, credit);
    console.log(result);
    return res.status(201).send("Subject created successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/Admin/Staff/viewStudentList', verifyTokenAdminStaff, async (req, res) => {
  try {
    const list = await viewStudentList();
    console.log(list);
    return res.status(201).json(list);
  }
  catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/Admin/staff/viewDetails', verifyTokenAdminStaff, async (req, res) => {
  try {
  
  const { staff_id } = req.body;
  console.log(req.user);
  // Ensure the user is either an admin or staff
  if (!req.user || (req.user.role !== 'staff' && req.user.role !== 'Admin')) {
    return res.status(403).send('Access denied: Only staff or admin can view staff details');
  }

  // Allow staff to view their own details or allow admins to view anyone's details
  if (req.user.role === 'staff' && req.user.staff_id !== staff_id) {
    return res.status(403).send('Access denied: You can only view your own staff details');
  }
    // Fetch the staff details using the provided staff_i
    const details = await viewDetails(staff_id);
    console.log(details);
    return res.status(200).json(details);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/Staff/RecordAttendance', verifyTokenStaff, (req, res) => {
  const { student_id, date, status, time } = req.body;
  try {
    RecordAttendance(student_id, date, status, time);
    res.status(201).send("Attendance recorded successfully");
  } catch (error) {

    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/students/viewDetails', verifyTokenStudent, async (req, res) => {
  try {
  
  const { student_id } = req.body;

  const user = await viewDetailss(student_id);
  console.log("User:", user);
  console.log("Req user:", req.user);

  if (!user) {
    return res.status(404).send('User not found');
  }

  if (req.user.student_id !== student_id) {
    return res.status(403).send('Access denied: You can only view your own details');
  }

    res.status(200).json(user); // Send the student's details as a response
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

