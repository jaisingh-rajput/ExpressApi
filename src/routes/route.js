const express = require('express')
const router = express.Router()
const register_user = require("../services/register_user")
const user_login = require("../services/user_login")
const update_user = require("../services/update_user")
const get_user = require("../services/get_user")

router.post("/register_user", register_user)
router.post("/user_login", user_login)
router.put("/update_user", update_user)
router.get("/get_user", get_user)

module.exports = router;