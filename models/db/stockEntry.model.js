const mongoose=require('mongoose')


// creating stockEntry model
const stockEntrySchema=mongoose.Schema({
              //  productId:{type:String,required:true},
               stockStatus:{type:String,required:true,enum: ["IN", "OUT"]},
               noOfUnits:{type:Number,required:true},
               Product:{
                  type:mongoose.Schema.Types.ObjectId,
                  ref:'product'
               }
             },{timestamps:true})
  
module.exports =mongoose.model('stockEntry',stockEntrySchema);