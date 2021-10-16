const mongoose=require('mongoose')

var products={
  productId:{type:String},
  quantity:{type:Number}
}

// creating token model
const serviceSchema=mongoose.Schema({
               name:{type:String,required:true},
               price:{type:Number,required:true},
               vehicleType:{type:String,required:true},
               servicePoints:{type:Number},
               productsUsed:[products],
             },{timestamps:true})
  
module.exports =mongoose.model('service',serviceSchema);