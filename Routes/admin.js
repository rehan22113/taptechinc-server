const express = require("express")
const Route = express.Router()
const {adminAuth} = require("../middleware/jwtAuth/auth")
const bodyParser = require("body-parser")
const Register = require("../Database/Schema/Register")
// const Fileupload  = require("express-fileupload")
const multer = require("multer")
const path = require("path")

//Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/profiles/',
    filename: function (req, file, cb) {
        cb(null,"profile_"+ file.fieldname + '-' + Date.now() + 
    path.extname(file.originalname));
    }
});

  
const upload = multer({ storage: storage })


// middleware
// Route.use(Fileupload())
Route.use(express.json())
Route.use(bodyParser.json());
Route.use(bodyParser.urlencoded({ extended: true }));

Route.get("/",(req,res)=>{
    console.log("admin");
    res.send("admin Route")
})

Route.patch("/picture/:userId",adminAuth,upload.single("picture"),async(req,res)=>{
    // res.send("picture")
    try{
        const picture = req.file.filename
        console.log("picture",picture);
        // res.status(200).send({file:req.file})
        // res.status(200).send("picture upload"+ req.file)
            const userId=req.params["userId"]

            // console.log(userId);
            const update =await Register.findOneAndUpdate({_id:userId},{$set:{picture}})
            await update.save();
            res.status(200).send({message:"User updated",file:picture})
    }catch(err){
        res.status(400).send(err)
        console.log("Error to update",err);
    }
})
Route.patch("/update/:userId",adminAuth,async(req,res)=>{
    try{
        const {email,password,confirm_password} = req.body
        if(password === confirm_password){
            const userId=req.params["userId"]

            console.log(userId);
            const update =await Register.findOneAndUpdate({_id:userId},{$set:{email,password}})
            await update.save();
            res.send({message:"User updated"}).status(200)
        }
        else{
            res.send({message:"password Doesn't Match"}).status(400)
        }
    }catch(err){
        res.status(400)
        console.log("Error to update",err);
    }
    
})

// const imageMimeType = ["image/JPG","image/png","image/JPEG"]
// function SaveImage(data,imgEncoded){
//     console.log("mydata",data,imgEncoded);
//         if(imgEncoded ===null) return;
//         const img = imgEncoded

//         if(img != null && imageMimeType.includes(img.type)){
//             data.picture = new Buffer.from(img.data, 'base64')
//         }
// }



module.exports = Route