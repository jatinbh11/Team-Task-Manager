const express = require("express");
const {
  createProject,
  getMyProjects,
  addMember,
  removeMember,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  createProjectValidator,
  manageMemberValidator,
} = require("../validators/projectValidators");

const router = express.Router();

router.use(protect);

router.post("/", createProjectValidator, validate, createProject);
router.get("/", getMyProjects);
router.patch("/:projectId/members/add", manageMemberValidator, validate, addMember);
router.patch("/:projectId/members/remove", manageMemberValidator, validate, removeMember);

module.exports = router;
