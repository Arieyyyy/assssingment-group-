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
  try {
    // Implement the logic to retrieve the student list
    const studentList = await retrieveStudentList();
    console.log(studentList); // Optional: Print the student list to the console

    return res.status(200).json({ data: studentList, message: "Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

async function retrieveStudentList() {
  try {
    const database = client.db('AttendanceManagementSystem');
    const collection = database.collection('faculties');

    const studentList = await collection.find().toArray();
    return studentList;
  } catch (error) {
    console.error("Error retrieving student list:", error);
  }
}


// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })