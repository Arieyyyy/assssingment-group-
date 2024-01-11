app.post ('/Admin/Login',(req,res)=>{
 
});

app.post('/Admin/AddStudent', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await client.db("AttendanceManagementSystem").collection("users").findOne({ "username": username });

        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await client.db("AttendanceManagementSystem").collection("users").insertOne({
            username: username,
            password: hashedPassword,
            role: role,
            matrix: matrix,
            email: email

        })

        res.send('Registration successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.post ('/Admin/Student List',(req,res)=>{

});
 