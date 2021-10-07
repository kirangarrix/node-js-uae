const mongoose=require('mongoose')


// creating token model
const tokenSchema=mongoose.Schema({
                userId:{type:String,required:true},
                token:{type:String,required:true},
                tokenType:{type:String,required:true,enum: ["AUTH_TOKEN", "PASSWORD_RESET_TOKEN"]}, 
             },{timestamps:true})
  
module.exports =mongoose.model('Token',tokenSchema)