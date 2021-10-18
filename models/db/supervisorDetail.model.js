const mongoose=require('mongoose')

const supervisorDetailSchema=mongoose.Schema({
               contactNumber:{type:String,required:true},
               dob:{type:Date,required:true},
               user:{
                  type:mongoose.Schema.Types.ObjectId,
                  ref:'Users'
                }
             },{timestamps:true})
  
module.exports =mongoose.model('supervisorDetail',supervisorDetailSchema);