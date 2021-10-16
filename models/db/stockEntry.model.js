const mongoose=require('mongoose')


// creating token model
const stockEntrySchema=mongoose.Schema({
               productId:{type:String,required:true},
               stockStatus:{type:String,required:true,enum: ["IN", "OUT"]},
               noOfUnits:{type:Number,required:true},
             },{timestamps:true})
  
module.exports =mongoose.model('stockEntry',stockEntrySchema);