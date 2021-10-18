require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


const userSchema = mongoose.Schema({
     name:{type:String,required:true},
     email:{type:String,required:true},
     password:{type:String,required:true},
     userType:{type:String,required:true,enum:["ROLE_ADMIN", "ROLE_SUPERVISOR"]},
     isActive:{type:Boolean,required:true,default:false}
},{timestamps:true})



      //generate a password hash using bcrypt 
userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) {
             return next();
     }
     const hash = await bcrypt.hash(this.password,10);
     this.password = hash;
     next();
});
              
    
 
 
 module.exports =mongoose.model('Users',userSchema)