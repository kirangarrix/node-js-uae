require("dotenv").config()
const {validationResult} = require("express-validator")



const responseModel = require("../models/api/response.model")
const statusCodes = require("../util/response-codes")
const userModel = require("../models/db/user.model")
const supervisorDetailModel = require("../models/db/supervisorDetail.model")
const config = require("../config/app.config")
const bcrypt = require("bcrypt")

exports.getAdvisors = (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }   

     //joining user and advisor detail
     supervisorDetailModel.find()
                    .select("_id contactNumber contactNumber dob")
                    .populate({path:"user",select:"_id name email isActive createdAt"})
                    .then(result =>{
                        
                        res.status(statusCodes.ok)
                            .json(responseModel("success","advisors list",{advisors:result}))
                    })
                    .catch((err)=>{
                        res.status(statusCodes.internal_server_error)
                            .json(responseModel("error",err+""))
                    })  
              
}


exports.editAdvisor = (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }    
     
    let advisorId = req.params.advisorId;
    
    let name = req.body.name;
    let email = req.body.email;
    let contactNumber = req.body.contactNumber;
    let dob =req.body.dob;
    

    supervisorDetailModel.findById(advisorId)
                         .then(result =>{
                             
                            if(!result) return res.status(statusCodes.not_found)
                                                   .json(responseModel("failed","not found"));
                            userModel.findByIdAndUpdate(result.user,{name:name,email,email})//result.user is userId
                                     .then(()=>{
                                        supervisorDetailModel.findByIdAndUpdate(advisorId,{contactNumber:contactNumber,dob:dob})
                                                             .then(()=>{
                                                                 res.status(statusCodes.ok)
                                                                    .json(responseModel("success","advisor updated"))
                                                             })
                                                             .catch((err)=>{
                                                                res.status(statusCodes.internal_server_error)
                                                                   .json(responseModel("error",err+""))
                                                            })  
                                     })
                                     .catch((err)=>{
                                        res.status(statusCodes.internal_server_error)
                                           .json(responseModel("error",err+""))
                                    })  

                             
                         })
                         .catch((err)=>{
                                res.status(statusCodes.internal_server_error)
                                    .json(responseModel("error",err+""))
                         })  
              
}

exports.editPassword = async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }    
     
    let advisorId = req.params.advisorId;
    
    //hashing password
    let password = req.body.password;
        password = await bcrypt.hash(password,10);
   

    supervisorDetailModel.findById(advisorId)
                         .then(result =>{
                             
                            if(!result) return res.status(statusCodes.not_found)
                                                   .json(responseModel("failed","not found"));
                            userModel.findByIdAndUpdate(result.user,{password:password})//result.user is userId
                                     .then(()=>{
                                      
                                        res.status(statusCodes.ok)
                                           .json(responseModel("success","password updated"))
        
                                     })
                                     .catch((err)=>{
                                        res.status(statusCodes.internal_server_error)
                                           .json(responseModel("error",err+""))
                                    })  

                             
                         })
                         .catch((err)=>{
                                res.status(statusCodes.internal_server_error)
                                    .json(responseModel("error",err+""))
                         })  
              
}

exports.editPassword = async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }    
     
    let advisorId = req.params.advisorId;
    
    //hashing password
    let password = req.body.password;
        password = await bcrypt.hash(password,10);
   

    supervisorDetailModel.findById(advisorId)
                         .then(result =>{
                             
                            if(!result) return res.status(statusCodes.not_found)
                                                   .json(responseModel("failed","not found"));
                            userModel.findByIdAndUpdate(result.user,{password:password})//result.user is userId
                                     .then(()=>{
                                      
                                        res.status(statusCodes.ok)
                                           .json(responseModel("success","password updated"))
        
                                     })
                                     .catch((err)=>{
                                        res.status(statusCodes.internal_server_error)
                                           .json(responseModel("error",err+""))
                                    })  

                             
                         })
                         .catch((err)=>{
                                res.status(statusCodes.internal_server_error)
                                    .json(responseModel("error",err+""))
                         })  
              
}

exports.updateLoginStatus = async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }    
     
    let advisorId = req.params.advisorId;
    
    //hashing password   
    //check for supervisor detail
    supervisorDetailModel.findById(advisorId)
                         .then(result =>{
                             
                            if(!result) return res.status(statusCodes.not_found)
                                                   .json(responseModel("failed","not found"));
                            let userId = result.user;
                            //find the user
                            userModel.findById(userId)//result.user is userId
                                     .then((user)=>{
                                        let isActive =user.isActive;
                                        
                                        //update active status
                                        userModel.findByIdAndUpdate(userId,{isActive:!isActive})
                                                 .then(()=>{
                                                     let message = !isActive?"activated":"de active";
                                                     res.status(statusCodes.ok)
                                                        .json(responseModel("success","user now "+message))
                                                 })
                                                 .catch((err)=>{
                                                     
                                                    res.status(statusCodes.internal_server_error)
                                                       .json(responseModel("error1",err+""))
                                                 })
                                         
        
                                     })
                                     .catch((err)=>{
                                        res.status(statusCodes.internal_server_error)
                                           .json(responseModel("error",err+""))
                                     })  

                             
                         })
                         .catch((err)=>{
                                res.status(statusCodes.internal_server_error)
                                    .json(responseModel("error",err+""))
                         })  
              
}