const mongoose =require("mongoose")

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId | String
    },
    cartID:{
        type:mongoose.Schema.Types.ObjectId | String
    },  
},{timeStamps:true})
const orderModel = mongoose.model("order",orderSchema)

module.exports = orderModel;