const mongoose = require("mongoose")

const mongoDB = ()=>{
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@taptechinc.dzp8d.mongodb.net/?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then((data)=>{
        console.log("Mongodb database connection established successfully {","name:",data.mongoose.connection.name,",host:",data.mongoose.connection.host," }");
    })
    .catch((err)=>{
        console.log("mongodb database connection error",err);
    })
}


module.exports = mongoDB