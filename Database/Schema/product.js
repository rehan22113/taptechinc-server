const mongoose = require("mongoose")


const product = mongoose.Schema({
    card_name:{
        type:String
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    status:{
        type:String,
        default:"active"
    },
    picture:{
        type:String,
        default:""
    }
},{timestamps:true})


const products = mongoose.model("product",product)

module.exports = products