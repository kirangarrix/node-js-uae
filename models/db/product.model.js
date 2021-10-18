const mongoose=require('mongoose')


// creating product model
const productSchema=mongoose.Schema({
               name:{type:String,required:true},
               description:{type:String},
               measuredUnit:{type:String,required:true,enum: ["LITTER", "NUMBER"]},
               pricePerUnit:{type:Number,required:true},
               openingQuantity:{type:Number,required:true},
               availableQuantity:{type:Number,required:true},
             },{timestamps:true})
  
module.exports =mongoose.model('product',productSchema);


