const { body, param } = require("express-validator");

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required."),
  body("description").optional().isString(),
];

const manageMemberValidator = [
  param("projectId").isMongoId().withMessage("Invalid project ID."),
  body("memberId").isMongoId().withMessage("Valid member ID is required."),
];

module.exports = {
  createProjectValidator,
  manageMemberValidator,
};
