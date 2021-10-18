const mongoose=require('mongoose')


// creating token model
const companySchema=mongoose.Schema({
               name:{type:String,required:true},
               emailAddress:{type:String,required:true},
               phone:{type:String,required:true},
               address:{type:String,required:true},
               creditLimit:{type:Number,required:true},
               currentCredit:{type:Number,required:true},
             },{timestamps:true})
  
module.exports =mongoose.model('company',companySchema);