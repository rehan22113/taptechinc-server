require("dotenv").config()
const express = require("express")
const App = express()
const PORT = process.env.PORT || 8070
const bodyParser = require("body-parser")
const cors =require("cors")
const {userAuth,adminAuth} = require("./middleware/jwtAuth/auth")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const mongoDB = require("./Database/MongoDB/mongo")
const productRoute = require("./Routes/products")
const adminRoute = require("./Routes/admin")
const loginRoute = require("./Routes/login")
const cart = require("./Routes/cart")
const path = require("path")
const register = require("./Database/Schema/Register")
// const Fileupload = require("express-fileupload")


// '===================================='
    mongoDB()
// '===================================='

// middleware
//public static
App.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// App.use(express.static(path.join(__dirname, 'public')));
App.use(cookieParser())
App.use(express.json())
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));
App.use(cors({ credentials: true, origin: "https://taptechinc.vercel.app" }))
App.use(session({
	secret:'secret123',
    resave:true,
    saveUninitialized:true
	}));
// ===//Outside Routes
App.use("/products",productRoute)
App.use("/admin",adminRoute)
App.use("/user",loginRoute)
App.use("/products/cart",cart)



//Routes
App.get("/",(req,res)=>{
    res.json({status:"OK",message:"Api working"}).status(200)
})

App.get("/dashboard",adminAuth,(req,res)=>{
    if(req.user && req.user.isAdmin){
        console.log("dashboard request come");
        res.status(200).send({user:req.user})
    }
    else{
        res.status(400).send("error on dashboard path")
    }
    
})

App.get("/picture/:filename",userAuth,(req,res)=>{
    const file = req.params["filename"]
    // console.log(file);
    if(file){
        res.status(200).sendFile(__dirname+"/public/uploads/profiles/"+file)
    }else{
        res.status(501).send("file Not Found")
    }
})

App.get("/products/:filename",(req,res)=>{
    const file = req.params["filename"]
    // console.log(file);
    if(file){
        res.status(200).sendFile(__dirname+"/public/uploads/products/"+file)
    }else{
        res.status(501).send("file Not Found")
    }
})

//user is login or not
App.get("/checkuser",userAuth,(req,res)=>{
    try{
        res.status(200).send({user:req.user})
    }catch(err){
        res.status(400).send("user denied")
        console.log(err);
    }
})
App.get("/allusers",adminAuth,async(req,res)=>{
    try{
        const users = await register.find().lean();
        res.status(200).send({users})
    }catch(err){
        res.status(401).send("Forbbiden! user denied")
        console.log(err);
    }
})

App.delete("user/delete/:id",adminAuth,async(req,res)=>{
    try{
      const id = req.params["id"]
      await register.findOneAndDelete({_id:id})  
      res.status(200).send({message:"User deleted"})
    }catch(err){
        console.log(`products delete nahi ho sakta error he `,err);
        res.status(400)
    }
})





// Server Config
App.listen(PORT,(err)=>{
    if(!err)
    console.log(`Server Started on ${PORT}`);
    else
    console.log("Server error in NODEJS ",err);
})