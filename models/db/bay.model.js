const mongoose=require('mongoose')


// creating token model
const baySchema=mongoose.Schema({
               bayName:{type:String,required:true},
               points:{type:Number},
               bayCommissionOfMonth:{type:Number}
             },{timestamps:true})
  
module.exports =mongoose.model('bay',baySchema);