const express = require("express");
const { getAllUsers } = require("../controllers/usersController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getAllUsers);

module.exports = router;
