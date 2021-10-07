require('dotenv').config()
const jwt = require('jsonwebtoken')
 
const statusCodes = require("../util/response-codes")
const responseModel = require("../models/api/response.model")

const userModel = require("../models/db/user.model")

function authenticateUser(req,res,next){
    //getting token from header
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(" ")[1] //either undefined or the token
    if(token==null){
       return res.status(statusCodes.not_acceptable).json(responseModel("error","no token found"))
    }else{
        //try to verify token 
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err) return res.status(statusCodes.unauthorized).json(responseModel("error","invalid token"))
            else{
                //decrypt  token payload and get userId and email 
                //check if  the email and userId exists in the DB
                userModel.findOne({_id:user.userId})
                          .then(result =>{
                             //console.log(result)
                             if(result.userCount === 0)return  res.status(statusCodes.unauthorized).json(responseModel("error","invalid token"))
                                req.user=user
                                req.token = token;
                                next()
                             
                             
                          })
                          .catch((err)=>{
                              res.status(statusCodes.internal_server_error)
                                 .json(responseModel("error",err+""))
                          })
               
            }
            
        })
    }
    
}




module.exports = {authenticateUser}