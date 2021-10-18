require("dotenv").config()
const {validationResult} = require("express-validator")



const responseModel = require("../models/api/response.model")
const statusCodes = require("../util/response-codes")
const companyModel = require("../models/db/company.model")

exports.addCompany = (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    
    
    let company = {
        name:req.body.name,
        emailAddress:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        creditLimit:req.body.creditLimit,
        currentCredit:req.body.creditLimit}

    let company_model = new companyModel(company);
    
    companyModel.findOne({name:req.body.name})
                 .then(result=>{
                     if(result) return  res.status(statusCodes.not_acceptable)
                                           .json(responseModel("failed","company with this name already added"))

                    
                     company_model.save()
                                  .then(()=>{
                                        res.status(statusCodes.ok)
                                           .json(responseModel("success","new company added"))
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

exports.getCompanies = (req,res)=>{
    companyModel.find()
                .then(results=>{
                    res.status(statusCodes.ok)
                       .json(responseModel("success","companies",{companies:results}))
                })
                .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                    .json(responseModel("error",err+""))
                })  
}

exports.editProduct = (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }
    
    let productId = req.params.productId;
    let description = req.body.description;
    
    let product = {
        name:req.body.name,
        description:description == undefined?"":description,
        measuredUnit:req.body.measuredUnit,
        pricePerUnit:req.body.pricePerUnit,
        openingQuantity:req.body.openingQuantity,
        availableQuantity:req.body.openingQuantity}
    
    //check any inventory data added against product 
     inventoryModel.findOne({productId:productId})
                   .then(result =>{
                       
                       if(result) return res.status(statusCodes.not_acceptable)
                                            .json(responseModel("failed","product has inventory entry unable to edit"))

                      productModel.findByIdAndUpdate(productId,product)
                                  .then(result=>{
                                         res.status(statusCodes.ok)
                                            .json(responseModel("success","product edited"))
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

// exports.deleteProduct = (req,res)=>{
 
//     let productId = req.params.productId;
    
//      //check any inventory data added against product 
//      inventoryModel.findOne({productId:productId})
//                    .then(result =>{
         
//                     if(result) return res.status(statusCodes.not_acceptable)
//                                          .json(responseModel("failed","product has inventory entry unable to delete"))

//                              productModel.findByIdAndDelete(productId)
//                                          .then(result=>{
                                             
//                                              if(!result) return res.status(statusCodes.not_found)
//                                                                    .json(responseModel("failed","product not found"))
                                             
//                                             res.status(statusCodes.ok)
//                                                .json(responseModel("success","product deleted"))
                                            
//                                          })
//                                          .catch((err)=>{
//                                             res.status(statusCodes.internal_server_error)
//                                             .json(responseModel("error",err+""))
//                                         })  
//                     })
//                     .catch((err)=>{
//                        res.status(statusCodes.internal_server_error)
//                           .json(responseModel("error",err+""))
//                     })   
 

// }