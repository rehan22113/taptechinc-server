const express = require("express")
const Route = express.Router()
const multer = require("multer")
const path = require("path")
const productSchema = require("../Database/Schema/product")
const {userAuth,adminAuth} = require("../middleware/jwtAuth/auth")
const mongoose = require("mongoose")

//Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/products/',
    filename: function (req, file, cb) {
        cb(null,"product_"+ file.fieldname + '-' + Date.now() + 
    path.extname(file.originalname));
    }
});

  
const upload = multer({ storage: storage })



Route.get("/",async(req,res)=>{
    try{
        const query = req.query['search']
        const allProducts = await productSchema.find().lean()
        // console.log(allProducts);
        res.status(200).send(allProducts)
    }catch(err){
        console.log("error he products get karne me",err);
    }
})

Route.patch("/upload",adminAuth,upload.single("picture"),async(req,res)=>{
    try{
        const {id,prevPic,card_name,price,description,status} =req.body
        console.log(req.file);
        console.log(id);
        let picture =""
        if(req.file){
            picture= req.file.filename
        }else{
            picture=prevPic
        }
        
        let newID;
        if(!id){
           newID = new mongoose.Types.ObjectId()
        }else{
            newID = id
        }
            await productSchema.findOneAndUpdate({_id:newID},{card_name,price,description,status,picture},{upsert:true})
        res.status(200).send("data sent")

    }catch(err){
        if(err){
            res.status(500).send({message:"SERVER CODE ISSUE! contact to owner"})
            console.log(err);
        }
    }
})
Route.get("/findProducts/:id",async(req,res)=>{
    try{

        const id = req.params["id"];
        const data = await productSchema.findOne({_id:id})
        res.status(200).send({data})
    }catch(err){
        console.log("error he find product me",err);
    }
})

Route.delete("/delete/:id",adminAuth,async(req,res)=>{
    try{
      const id = req.params["id"]
      await productSchema.findOneAndDelete({_id:id})  
      res.status(200).send({message:"product deleted"})
    }catch(err){
        console.log(`products delete nahi ho sakta error he mama `,err);
    }
})

// Route.get("/picture/:filename",Auth,(req,res)=>{
//     const file = req.params["filename"]
//     // console.log(file);
//     if(file){
//         res.status(200).sendFile(__dirname+"/public/uploads/products/"+file)
//     }else{
//         res.status(501).send("file Not Found")
//     }
// })

module.exports = Route