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
// Placeholder for the 'view' module or functions
async function getStudentListForStaff(staff_id) {
    try {
        const database = client.db('AttendanceManagementSystem');
        const collection = database.collection('Students');

        // Assuming there's a field in the Students collection that indicates the staff to which the student belongs
        const studentList = await collection.find({ staff_id: staff_id }).toArray();
        
        return studentList;
    } catch (error) {
        console.error("Error fetching student list:", error);
        // You might want to handle the error more gracefully, e.g., by returning an empty array or throwing an exception.
        return [];
    }
}


async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
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

app.post('/Staff/StudentList', async (req, res) => {
  const { student_id, course_id, date, faculty } = req.body;

  try {
    await saveStudentList(student_id, course_id, date, faculty);
    return res.status(200).json({ message: "Student list saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

async function saveStudentList(student_id, course_id, date, faculty) {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('Faculties');

    // Replace the logic below with your actual implementation
    // Save the student list to the "Faculties" collection
    await collection.insertOne({
      student_id: student_id,
      course_id: course_id,
      date: date,
      faculty: faculty
    });
  } catch (error) {
    console.error("Error saving student list:", error);
  }
}


// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })