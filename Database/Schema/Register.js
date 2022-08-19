const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const registerSchema = mongoose.Schema({
    picture:{
        type:String,
        default:"https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
    },
    userName:{
        firstName:String,
        lastName:String
    },
    companyName:{
        type:String
    },
    address:{
        country:{
            type:String
        },
        city:{
            type:String
        },
        streetAddress:{
            String
        },
        zipCode:{
            type:String
        },
        state:{
            type:String
        }
    },
    phone:{
        type:String
    },
    role:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate(value){
              console.log(validator.isEmail(value));
              if(!validator.isEmail(value)){ 
                throw new Error("Email Not valid") 
              }
        }
    },
    password:{
        type:String,
        require:true,
        // validate(value){
        //     if(validator.isStrongPassword(value)){
        //         throw new Error("Password Not Strong")
        //     }
        // }
    },
    tokens:[{
        token:{
         type:String,
         unique:true
        }
     }],
},
{
    timestamps:true
})


registerSchema.methods.generateAuthToken = async function(req,res){
    try{
     const token = jwt.sign({_id:this._id.toString()},"anytoknen32wordmore");
     this.tokens = this.tokens.concat({token:token})
     await this.save();
     return token;
    }
    catch(err){
    //    throw new Error("Token not generated error")
    console.log(err);
    }
}


const register = mongoose.model("User",registerSchema)

module.exports = register