const express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const {authenticateUser} = require("../middleware/authentication.middleware")
let productController = require("../controllers/product.controller")


router.post("/",authenticateUser
                 ,[body("name").trim().not().isEmpty(),
                   body('measuredUnit').isIn(['LITTER', 'NUMBER']),
                   body("pricePerUnit").trim().not().isEmpty(),
                   body("openingQuantity").trim().not().isEmpty(),
                ],productController.addProduct);

router.get("/",authenticateUser,productController.getProducts);

router.put("/:productId",///authenticateUser,
                        [body("name").trim().not().isEmpty(),
                        body('measuredUnit').isIn(['LITTER', 'NUMBER']),
                        body("pricePerUnit").trim().not().isEmpty(),
                        body("openingQuantity").trim().not().isEmpty(),
                        body("description").trim().not().isEmpty(),
                        body("availableQuantity").trim().not().isEmpty()
                        ],productController.editProduct);

router.delete("/:productId",//authenticateUser
                        productController.deleteProduct);

module.exports =router