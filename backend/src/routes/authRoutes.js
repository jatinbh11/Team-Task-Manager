const express = require("express");
const { signup, login } = require("../controllers/authController");
const validate = require("../middleware/validateMiddleware");
const { signupValidator, loginValidator } = require("../validators/authValidators");

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);

module.exports = router;
