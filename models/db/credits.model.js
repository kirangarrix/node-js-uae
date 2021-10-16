const mongoose=require('mongoose')


// creating token model
const creditsSchema=mongoose.Schema({
               companyId:{type:String,required:true},
               creditAmount:{type:String,required:true},
             },{timestamps:true})
  
module.exports =mongoose.model('credit',creditsSchema);