const express = require("express")
const router = express.Router()
const {body,query} = require("express-validator")
const {authenticateUser} = require("../middleware/authentication.middleware")
let inventoryController = require("../controllers/inventory.controller")


router.post("/",authenticateUser
                 ,[body("productId").trim().not().isEmpty(),
                   body('stockStatus').isIn(['IN', 'OUT']),
                   body("noOfUnits").trim().not().isEmpty(),
                ],inventoryController.addEntry);

router.get("/",authenticateUser,[query("startDate").trim().not().isEmpty(),
                query('endDate').trim().not().isEmpty()],inventoryController.getInventoryList);

router.delete("/:inventoryListId",authenticateUser,
                        inventoryController.deleteInventoryList);

module.exports =router