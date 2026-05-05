const { validationResult } = require("express-validator");

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      statusCode: 400,
      message: errors.array().map((err) => err.msg).join(", "),
    });
  }
  next();
};

module.exports = validate;
