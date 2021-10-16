const mongoose=require('mongoose')


// creating token model
const workSchema=mongoose.Schema({
               serviceId:{type:String,required:true},
               serviceGroupId:{type:String,required:true},
               supervisorId:{type:String,required:true},
               bayId:{type:Number,required:true},
               creditOrNot:{type:String,required:true,enum:["YES", "NO"]},
               creditId:{type:String,required:true},
               vehicleNumber:{type:String,required:true},
               vehicleBrand:{type:String,required:true},
               vatTotal:{type:Number,required:true},
               serviceAmountTotal:{type:Number,required:true},
               productsAmountTotal:{type:Number,required:true},
               grandTotalAmount:{type:Number,required:true},
               customer:{
                    name:{type:String,required:true},
                    phone:{type:String,required:true},
                    email:{type:String,required:true}}
             },{timestamps:true})
  
module.exports =mongoose.model('work',workSchema);