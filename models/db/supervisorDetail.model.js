const mongoose=require('mongoose')

const supervisorDetailSchema=mongoose.Schema({
               userId:{type:String,required:true},
               contactNumber:{type:String,required:true},
               dob:{type:String,required:true},
             },{timestamps:true})
  
module.exports =mongoose.model('supervisorDetail',supervisorDetailSchema);