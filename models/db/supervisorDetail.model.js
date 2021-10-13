const mongoose=require('mongoose')


// creating token model
const supervisorDetailSchema=mongoose.Schema({
                userId:{type:String,required:true},
                contactNumber:{type:String,required:true},
                dob:{type:String,required:true},
                commission:{type:Number},
                creditPoints:{type:Number},
             },{timestamps:true})
  
module.exports =mongoose.model('supervisorDetail',supervisorDetailSchema);