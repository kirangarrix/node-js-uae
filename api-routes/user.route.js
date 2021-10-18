const express = require("express")
const router = express.Router()
const {body} = require("express-validator")

const userController = require("../controllers/user.controller")
const {authenticateUser} = require("../middleware/authentication.middleware")


router.post("/",authenticateUser
                ,[body("name", "Enter a valid name").trim().not().isEmpty(),
                 body("email","Enter a valid email").trim().isEmail(),
                 body('password',"Password must be at least 6 character long").trim().isLength({min:6}),
                 body("contactNumber", "invalid phone number").trim().isLength({min:10,max:10}),
                 body("dob", "Enter a valid name").trim().not().isEmpty()
                ],userController.register);


router.post("/login",[body("email","Enter a valid email").trim().isEmail(),
                      body('password',"required").trim().not().isEmpty()],
                    userController.login)

router.get('/:emailId/send-reset-mail',userController.sendPasswordResetMail);

router.put("/reset-password",[body("token", "required").trim().not().isEmpty(),
                              body("password", "required").trim().not().isEmpty(),]
                              ,userController.resetPassword)

router.delete("/logout",userController.logoutUser);                           



module.exports = router