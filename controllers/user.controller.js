require("dotenv").config()
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const responseModel = require("../models/api/response.model")
const statusCodes = require("../util/response-codes")
const userModel = require("../models/db/user.model")
const tokenModel = require("../models/db/token.model")
const supervisorDetailModel = require("../models/db/supervisorDetail.model")
const config = require("../config/app.config")

exports.register = (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }
    
    let user = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        isActive:false,
        userType:"ROLE_SUPERVISOR"}

    let user_model = new userModel(user)
    
    //check email exists
    userModel.findOne({email:req.body.email})
             .then((result =>{
                 if(result) return res.status(statusCodes.not_acceptable)
                                      .json(responseModel("failed","email already exists"))
                 //save user info
                 user_model.save()
                           .then((user)=>{
                                let userId = user.id;
                                  
                                let userDetail ={
                                    user:userId,
                                    contactNumber:req.body.contactNumber,
                                    dob:req.body.dob}

                                    let userDetail_model = new supervisorDetailModel(userDetail);
                                     
                                    //save user details
                                    userDetail_model.save()
                                                    .then(()=>{
                                                        res.status(statusCodes.ok)
                                                           .json(responseModel("success","new user added"))
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
                    
             }))
             .catch((err =>{
                 res.status(statusCodes.internal_server_error)
                    .json(responseModel("error",""+err))
             }))
    

}

exports.login =(req,res) =>{
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }
    
    let email=req.body.email
    let password=req.body.password

    userModel.findOne({email:email})
             .then(async (user)=>{
                  if(user==null) return res.status(statusCodes.not_found)
                                           .json(responseModel("failed","email not registered"))
                  else{
                      if(!user.isActive) return res.status(statusCodes.unauthorized)
                                                   .json(responseModel("failed","user is not active"));

                   //email found now check for password 
                   let dbPassword=user.password                     
                   try{
                       if(await bcrypt.compare(password,dbPassword)){
                        let payLoad ={
                              userId:user._id,
                              userType:user.userType}

                         //generate refresh token and access token using jwt
                        let accessToken = generateToken(payLoad,process.env.ACCESS_TOKEN_SECRET,'10m')
                        let refreshToken = generateToken(payLoad,process.env.REFRESH_TOKEN_SECRET)

                        let token_model=new tokenModel({token:refreshToken,userId:user._id,tokenType:"AUTH_TOKEN"})
                         
                        //save refresh token 
                        token_model.save()
                                   .then(( )=>{
                                          return res.status(statusCodes.ok)
                                                    .json(responseModel("success","user logged in ",{name:user.name,
                                                                                                     userType:user.userType,
                                                                                                     id:user._id,
                                                                                                     //accessToken:accessToken,
                                                                                                     refreshToken:refreshToken
                                                                                                    }))
                                       })
                                   .catch((err)=>{
                                       return res.status(statusCodes.internal_server_error)
                                                 .json(responseModel("error",""+err))
                                    })
                  } 
                  else return res.status(statusCodes.unauthorized)
                                 .json(responseModel("failed","invalid password"))
          }catch(err){
              return res.status(statusCodes.internal_server_error)
                        .json(responseModel("error",""+err))
          }
          
      }
        
    })
    .catch((err)=>res.status(statusCodes.internal_server_error)
                     .json(responseModel("error",""+err)))
}

exports.sendPasswordResetMail =(req,res) =>{
    let testEmail = req.params.emailId
    // check the mail id exists or not 
    userModel.findOne({email:testEmail})
             .then(user =>{
                 if(!user) return res.status(statusCodes.not_found)
                                       .json(responseModel("failed","email not found"))

                // email id exists sent pass word reset link to mail
                let payLoad ={
                    userId:user._id,
                    userType:user.userType}

                let token=generateToken(payLoad,process.env.PASSWORD_RESET_TOKEN_SECRET,"60m")
                let tokenObj={userId:user.id,token:token,tokenType:"PASSWORD_RESET_TOKEN"}
                let token_model=new tokenModel(tokenObj)
                
                token_model.save()
                            .then((token)=>{
                                // res.send("okay");
                                let mail_string = `<h4>This is auto generated password reset mail from
                                                      ${config.program}.</h4>
                                                     <h5>If your not requested just ignore this mail.</h5>
                                                     <h5><a clicktracking="off" 
                                                      href='${process.env.FRONT_END_URL}/reset-password?id=${tokenObj.token}'>
                                                      click here to reset password</a></h5>`;
                                let email={
                                    to:user.email,
                                    from:process.env.FROM_MAIL,
                                    subject:'Reset password in '+config.program,
                                    html:mail_string}

                                    sgMail.send(email)
                                          .then(() => {
                                              res.status(statusCodes.ok)
                                                 .json(responseModel("success","check your mail to reset password"))
                                              
                                           }, error => {
                                                res.status(statusCodes.internal_server_error)
                                                   .json(responseModel("error",error+""))
                                           });

                            })
                            .catch((err)=>res.status(statusCodes.internal_server_error)
                                             .json(responseModel("error",""+err)))
                

                
             })
             .catch((err)=>res.status(statusCodes.internal_server_error)
                              .json(responseModel("error",""+err)))


}

exports.resetPassword = (req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    let token = req.body.token;
    let password = req.body.password;
    // check the token exists in DB
    tokenModel.findOne({token:token})
              .then(result=>{
                  if(!result) return res.status(statusCodes.unauthorized)
                                       .json(responseModel("failed","token not found"));
                    //verify token with jwt 
                   jwt.verify(result.token,process.env.PASSWORD_RESET_TOKEN_SECRET,async (err,user)=>{
                      if(err) return res.status(statusCodes.unauthorized)
                                        .json(responseModel("failed","invalid token"))
                      else{
                        //check if  userId from db exists in the DB
                        let userID=user.userId;
                        let hash = await bcrypt.hash((password),10)
                        userModel.findByIdAndUpdate(userID,{password:hash})
                                  .then(()=>{
                                    //   password rested
                                      res.status(statusCodes.ok)
                                         .json(responseModel("success","password updated"))

                                  })
                                  .catch((err)=>res.status(statusCodes.internal_server_error)
                                  .json(responseModel("error",""+err)))
                     }
        
    })
              })
              .catch((err)=>res.status(statusCodes.internal_server_error)
                              .json(responseModel("error",""+err)))

}

exports.logoutUser =(req,res)=>{

    let token = req.body.token;
    tokenModel.findOne({token:token})
               .then(result =>{
                 
                 if(!result) return res.status(statusCodes.not_found)
                                      .json(responseModel("failed","token not found"))

                 res.status(statusCodes.ok)
                    .json(responseModel("success","user logged out"))
               })
               .catch((err)=>res.status(statusCodes.internal_server_error)
                                .json(responseModel("error",""+err)))
}

function generateToken(_user,_envSecret,_time){
    if(_time) return jwt.sign(_user,_envSecret,{expiresIn:_time})
    return jwt.sign(_user,_envSecret)
}