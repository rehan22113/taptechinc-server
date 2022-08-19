const express = require("express")
const Route = express.Router()
const {userAuth} = require("../middleware/jwtAuth/auth")
const cart = require("../Database/Schema/cart")
const bodyParser = require("body-parser")

Route.use(bodyParser.json())
Route.use(bodyParser.urlencoded({ extended: true }));


Route.post("/add-to-cart",userAuth,async(req,res)=>{
        const userId = req.user
        const {productId,price,qty} = req.body
        console.log(req.body);
        const cartData = new cart({
            userId,
            cartItems:{
                productId,price,qty
            }
        })
        await cartData.save((err,doc)=>{
            if(err)
            console.log(`error he cart saving me`,err);
            else
            res.status(200).send({message:"product added to card successfuly",data:doc})
        })
})

Route.get("/",userAuth,async(req,res)=>{
    const userId = req.user
    const id = req.body
    console.log(req.body);
    res.send("hi")
})


module.exports = Route