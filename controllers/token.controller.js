const {validationResult} = require("express-validator")

const responseModel = require("../models/api/response.model")
const statusCodes = require("../util/response-codes")
const tokenModel = require("../models/db/token.model")
const jwt = require("jsonwebtoken")

exports.getAccessToken = async (req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    let testToken = req.body.refreshToken;
    
    jwt.verify(testToken,process.env.REFRESH_TOKEN_SECRET,(err,token)=>{
        if(err)return res.status(statusCodes.not_acceptable)
                         .json(responseModel("failed","token not verified"))

        // double check with DB
        tokenModel.findOne({token:testToken})
                  .then(result=>{
                    if(!result) return res.status(statusCodes.not_found)
                                          .json(responseModel("failed","token not found"))

                    //generate and send access token
                    
                    let payload = {userId:result.userId}
                    let accessToken = generateToken(payload,process.env.ACCESS_TOKEN_SECRET,"2m")
                    res.status(statusCodes.ok)
                       .json(responseModel("success","access token",{accessToken:accessToken}))
                  })
                  .catch((err)=>{
                      console.log(err)
                        return res.status(statusCodes.internal_server_error)
                                  .json(responseModel("error",""+err))
                    })
    })

}


function generateToken(_user,_envSecret,_time){
    if(_time) return jwt.sign(_user,_envSecret,{expiresIn:_time})
    return jwt.sign(_user,_envSecret)
}