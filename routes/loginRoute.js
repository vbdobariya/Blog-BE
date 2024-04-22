const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

router.post("/admin/login", loginController.login);
router.post("/user/login", loginController.userLogin);

router.post("/register", loginController.register);

module.exports = router;
