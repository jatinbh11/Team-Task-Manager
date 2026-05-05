const express = require("express");
const {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  updateTaskByAdmin,
  deleteTaskByAdmin,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  createTaskValidator,
  updateTaskStatusValidator,
  updateTaskValidator,
} = require("../validators/taskValidators");

const router = express.Router();

router.use(protect);

router.post("/project/:projectId", createTaskValidator, validate, createTask);
router.get("/project/:projectId", getProjectTasks);
router.patch("/:taskId/status", updateTaskStatusValidator, validate, updateTaskStatus);
router.patch("/:taskId", updateTaskValidator, validate, updateTaskByAdmin);
router.delete("/:taskId", deleteTaskByAdmin);

module.exports = router;
