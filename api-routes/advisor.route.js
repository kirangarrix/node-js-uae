const express = require("express")
const router = express.Router()
const {body} = require("express-validator")

const advisorController = require("../controllers/advisor.controller")
const {authenticateUser} = require("../middleware/authentication.middleware")

router.get('/',advisorController.getAdvisors);

router.put('/:advisorId',authenticateUser,advisorController.editAdvisor);
router.put('/:advisorId/update-password/',authenticateUser,advisorController.editPassword)                   
router.put("/:advisorId/active-status",advisorController.updateLoginStatus)


module.exports = router