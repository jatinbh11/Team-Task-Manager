const { body, param } = require("express-validator");

const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required."),
  body("description").optional().isString(),
  body("dueDate").isISO8601().withMessage("A valid due date is required."),
  body("priority")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High."),
  body("assignedTo").isMongoId().withMessage("Valid assigned user is required."),
  param("projectId").isMongoId().withMessage("Invalid project ID."),
];

const updateTaskStatusValidator = [
  param("taskId").isMongoId().withMessage("Invalid task ID."),
  body("status")
    .isIn(["To Do", "In Progress", "Done"])
    .withMessage("Invalid status."),
];

const updateTaskValidator = [
  param("taskId").isMongoId().withMessage("Invalid task ID."),
  body("title").optional().trim().notEmpty().withMessage("Task title cannot be empty."),
  body("description").optional().isString(),
  body("dueDate").optional().isISO8601().withMessage("A valid due date is required."),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High."),
  body("assignedTo").optional().isMongoId().withMessage("Valid assigned user is required."),
  body("status")
    .optional()
    .isIn(["To Do", "In Progress", "Done"])
    .withMessage("Invalid status."),
];

module.exports = {
  createTaskValidator,
  updateTaskStatusValidator,
  updateTaskValidator,
};
