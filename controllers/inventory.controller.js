require("dotenv").config()
const {validationResult} = require("express-validator")


const responseModel = require("../models/api/response.model")
const statusCodes = require("../util/response-codes")
const stockEntryModel = require("../models/db/stockEntry.model")
const productModel = require("../models/db/product.model")

const config = require("../config/app.config")

exports.addEntry = (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    
    let productId =req.body.productId
    let stockStatus= req.body.stockStatus
    let noOfUnits = req.body.noOfUnits

        
    
    //find product 
    productModel.findById(productId)
                .then(result =>{
                    let availableQuantity = result.availableQuantity;
                    let stockUpdateStatus = false;
                    if(stockStatus === "OUT"){
                        //not enough stocks
                        if(availableQuantity < noOfUnits) return res.status(statusCodes.not_acceptable)
                                                                    .json(responseModel("failed","stock quantity is not enough"))

                        // decrease available stocks in products
                        let currentQuantity = availableQuantity - noOfUnits
                        productModel.findByIdAndUpdate(productId,{availableQuantity:currentQuantity})
                                    .then((product)=>{
                                        stockUpdateStatus = true;
                                    })
                                    .catch((err)=>{
                                        res.status(statusCodes.internal_server_error)
                                            .json(responseModel("error",err+""))
                                    })
                    }

                    if(stockStatus === "IN"){
                        //increase available stocks
                        let currentQuantity = availableQuantity + noOfUnits
                        productModel.findByIdAndUpdate(productId,{availableQuantity:currentQuantity})
                                    .then((product)=>{
                                        stockUpdateStatus = true;
                                    })
                                    .catch((err)=>{
                                        res.status(statusCodes.internal_server_error)
                                            .json(responseModel("error",err+""))
                                    })
                    }
                    
                    //stock count updated in product db now 
                    if(stockStatus){
                        let stockEntry = {
                            productId:productId,
                            stockStatus:stockStatus,
                            noOfUnits:noOfUnits}     
                        let stockEntry_model = new stockEntryModel(stockEntry)
    
                        stockEntry_model.save()
                                        .then(()=>{
                                             res.status(statusCodes.ok)
                                                .json(responseModel("success","new stock entry added"))
                                        })
                                        .catch((err)=>{
                                            res.status(statusCodes.internal_server_error)
                                                .json(responseModel("error",err+""))
                                        })
                    }
                    

                })
                .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                        .json(responseModel("error",err+""))
                })

}

exports.getInventoryList = (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(statusCodes.not_acceptable)
                  .json(responseModel("failed","validation errors",{errors: errors.array()}))
    }

    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    stockEntryModel.find({
                         $and:[
                             {createdAt:{$gte: new Date(new Date(startDate).setHours(00, 00, 00)),
                                          $lt: new Date(new Date(endDate).setHours(23, 59, 59))}}]})
                  .then(result =>{
                        res.status(statusCodes.ok)
                           .json(responseModel("success","inventory list",{inventoryList:result}))
                   })
                  .catch((err)=>{
                        res.status(statusCodes.internal_server_error)
                           .json(responseModel("error",err+""))
                  })  
}


exports.deleteInventoryList = (req,res)=>{
 
    let inventoryListId = req.params.inventoryListId;
    
    stockEntryModel.findByIdAndDelete(inventoryListId)
                   .then(result=>{
                     
                     if(!result) return res.status(statusCodes.not_found)
                                           .json(responseModel("failed","inventory list item not found"))
                     
                    res.status(statusCodes.ok)
                       .json(responseModel("success","inventory list item deleted"))
                    
                 })
                 .catch((err)=>{
                    res.status(statusCodes.internal_server_error)
                    .json(responseModel("error",err+""))
                })   

}