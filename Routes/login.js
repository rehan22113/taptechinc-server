const express = require("express")
const Route = express.Router()
const {userAuth} = require("../middleware/jwtAuth/auth")
const register = require("../Database/Schema/Register")
const bodyParser = require("body-parser")

Route.use(bodyParser.json())
Route.use(bodyParser.urlencoded({ extended: true }));



Route.post("/login",async(req,res)=>{
    try{ 
        const {email,password} = req.body;
        const userData =await register.findOne({email:email,password:password})
        // console.log(userData);
        if(!(userData===null) && userData.password === password){
            // console.log("helllldslkdlsakdlsa");
            const token =await userData.generateAuthToken()
            res.cookie("jwt",token,{httpOnly:true})
            res.send({message:"Logged in",userData}).status(200)
        }
        if(userData===null){
            res.status(400).send({message:"Wrong Crediential"})
        }
        res.status(400)
            
        }
    catch(err){
        console.log("Error he login Router me",err);
        res.status(400)
    }
})

Route.post("/register",async(req,res)=>{
    try{
        const {firstName,lastName,email,password} = req.body;
        console.log(firstName,lastName,email,password);
        const userData = register({
            'userName.firstName':firstName,'userName.lastName':lastName,email:email,password:password
        })
       const token=await userData.generateAuthToken()
       res.cookie("jwt",token)
        await userData.save()
        res.json({message:"Sucessfully Register"}).status(200)
    }catch(err){
        console.log("register nahi hua",err);
        res.json({message:"Error"}).status(400)
    }
})

Route.get("/logout",userAuth,async(req,res)=>{
    try{

        req.user.tokens = req.user.tokens.filter(elem=>elem.token != req.token)
        await req.user.save()
        res.clearCookie("jwt",{path:"/"});
        res.json({message:"User Logout"}).status(200)
    }
    catch(err){
        console.log("Error in logout Route",err);
    }
})


module.exports = Route