const express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const {authenticateUser} = require("../middleware/authentication.middleware")
let inventoryController = require("../controllers/inventory.controller")


router.post("/"//,authenticateUser
                 ,[body("productId").trim().not().isEmpty(),
                   body('stockStatus').isIn(['IN', 'OUT']),
                   body("noOfUnits").trim().not().isEmpty(),
                ],inventoryController.addEntry);

// router.get("/",authenticateUser,productController.getProducts);

// router.put("/:productId",authenticateUser,
//                         [body("name").trim().not().isEmpty(),
//                         body('measuredUnit').isIn(['LITTER', 'NUMBER']),
//                         body("pricePerUnit").trim().not().isEmpty(),
//                         body("openingQuantity").trim().not().isEmpty(),
//                         body("description").trim().not().isEmpty(),
//                         body("availableQuantity").trim().not().isEmpty()
//                         ],productController.editProduct);

// router.delete("/:productId",//authenticateUser
//                         productController.deleteProduct);

module.exports =router