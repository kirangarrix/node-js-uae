const express = require("express")
const router = express.Router()
const {body} = require("express-validator")
const tokenController = require("../controllers/token.controller")

router.post('/new-token',body("refreshToken","required").trim().not().isEmpty(),
                tokenController.getAccessToken);



module.exports =router