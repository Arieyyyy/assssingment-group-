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

app.post('/Staff/viewReport', async (req, res) => {
    const { staff_id, date } = req.body;

    try {
       
        const reportData = await view.viewReport(client, staff_id, date);
        console.log(reportData);
        return res.status(200).json({ data: reportData, message: "Successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.post('/Staff/StudentList', async (req, res) => {
    const { student_id, course_id, date, studentList } = req.body;

    try {
        // You can handle the studentList data, perform validation, and store it in your database
        // For example, assuming you have a function in your 'view' module named 'saveStudentList'
        await view.saveStudentList(client, student_id, course_id, date, studentList);

        return res.status(200).json({ message: "Student list saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});



app.post('/Staff/viewDetails', async (req, res) => {
    const { staff_id } = req.body;

    try {
        const staffDetails = await view.getStaffDetails(client, staff_id);
        console.log(staffDetails);
        return res.status(200).json({ data: staffDetails, message: "Successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


