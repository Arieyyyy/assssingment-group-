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

  app,post('/students/login', (req, res) => {
})

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

app.post('/Students/RecordAttendance', (req, res) => {
    const { student_id, date, status } = req.body;
  try {
    RecordAttendance(student_id, date, status);
    res.status(201).send("Attendance recorded successfully");
  } catch (error) {

    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
})

 
 
app.post('/students/viewDetails', (req, res) => {
    const { student_id } = req.body;

    try {
        const details = await view.viewDetails(client, student_id);
        console.log(details);
        return res.status(201).send("Successful");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});


app.post('/students/ViewReport', (req, res) => {
    try {
        const list = await view.ViewReport(client);
        console.log(list);
        return res.status(201).send("View Report Successful");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
})

app.get('/logout', (req, res) => {
    res.status(200).send('Logout successfuly');
  });
  
app.listen(port, () => {
    console.log(Example app listening on port ${port})
})