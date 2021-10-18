const express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const {authenticateUser} = require("../middleware/authentication.middleware")
let companyController = require("../controllers/company.controller")


router.post("/",authenticateUser
                 ,[body("name").trim().not().isEmpty(),
                   body("email","Enter a valid email").trim().isEmail(),
                   body("phone", "invalid phone number").trim().isLength({min:10,max:10}),
                   body("address").trim().not().isEmpty(),
                   body("creditLimit", "credit limit exceeded").trim().isLength({max:7}),
                  ],companyController.addCompany);

router.get("/",authenticateUser,companyController.getCompanies);

router.put("/:companyId",///authenticateUser,
                      [body("name").trim().not().isEmpty(),
                      body("email","Enter a valid email").trim().isEmail(),
                      body("phone", "invalid phone number").trim().isLength({min:10,max:10}),
                      body("address").trim().not().isEmpty(),
                      body("creditLimit", "credit limit exceeded").trim().isLength({max:7}),
                      ],companyController.addCompany);



module.exports =router