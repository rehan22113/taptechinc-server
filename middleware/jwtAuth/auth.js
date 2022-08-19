const Register =require("../../Database/Schema/Register")
const jwt = require("jsonwebtoken")
const adminAuth = async(req,res,next)=>{
    // console.log("auther");
    try{
    const token = req.cookies.jwt;
    if(!token){
        res.status(400)
        throw new Error("Token not Found")
    }
    const verifyUser = await jwt.verify(token,"anytoknen32wordmore")
    // console.log(verifyUser);
    const user = await Register.findOne({_id:verifyUser._id,isAdmin:true,"tokens.token":token})
    // console.log(user)
    req.token = token;
    req.user = user;
    if(user.isAdmin){
        next();
    }
    else{
        throw new Error("Can't access this page")
    }
    }
    catch(ERR){
    res.send(ERR).status(400);
    
    }
} 
const userAuth = async(req,res,next)=>{
    // console.log("auther");
    try{
    const token = req.cookies.jwt;
    if(!token){
        res.status(400)
        throw new Error("Token not Found")
    }
    const verifyUser = await jwt.verify(token,"anytoknen32wordmore")
    // console.log(verifyUser);
    const user = await Register.findOne({_id:verifyUser._id,"tokens.token":token})
    // console.log(user)
    req.token = token;
    req.user = user;
    next();
    }
    catch(ERR){
    res.send(ERR).status(400);
    
    }
}   




module.exports = {adminAuth,userAuth}