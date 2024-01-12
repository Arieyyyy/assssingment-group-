async function createStudent(Username, Password, StudentId, Email, Phone, PA) {
    try {
      const database = client.db('AttendanceManagementSystem');
      const collection = database.collection('Users');
  
      // Create a user object
      const user = {
        username: Username,
        password: Password,
        student_id: StudentId,
        email: Email,
        role: "Student"
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

 app,post('/students/login', (req, res) => {
})
 
app.post('/students/viewDetails', (req, res) => {
})

app.post('/students/ViewReport', (req, res) => {
})

