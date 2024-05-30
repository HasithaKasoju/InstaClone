const express=require('express');
const app=express();
const PORT=5000;
const cors=require('cors');
app.use(cors());
const  path=require('path');
const session=require('express-session');
const {mongoUrl,Jwt_secret}=require('./Keys');
const mongoose =require('mongoose');
require('../backend/models/model');
const postrouter =require('../backend/routes/Posts');
const approuter=require('../backend/routes/auth');
mongoose.connect(mongoUrl);
app.use(express.json());
const middleware=require('../backend/middleware/requiredLogin')
console.log(process.env.SESSION_KEY);
mongoose.connection.on("connected", () => {
    console.log("Successfully connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
});
app.use(session({
    secret:'mykey1234',
    resave:false,
    saveUninitialized:true,

}))

app.use('/',approuter);
app.use("/",postrouter);
app.use(express.static(path.join(__dirname,"./frontend/build")))
app.get('*',(req,res)=>
{
    res.sendFile(
        path.join(__dirname,'./frontend/build/index.html'),
        function(err)
        {
              res.status(500).send(err)
        }
    )
})
app.listen(PORT,console.log("listening"));
