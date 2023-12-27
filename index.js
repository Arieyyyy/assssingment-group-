const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
app.use(express.json())
app.get('/', (req, res) => {
 res.send('Hello World!')
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
    
    client.db 
}
)

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})

git
adddd
lalalalall