const mongoose =require("mongoose")

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId | String
    },
    cartItems:[
        {
            productId:mongoose.Schema.Types.ObjectId | String,
            price:{
                type:String
            },
            qty:{
                type:Number,
                default:1
            }
        }
    ]
},{timeStamps:true})
const cartModel = mongoose.model("cart",cartSchema)

module.exports = cartModel;