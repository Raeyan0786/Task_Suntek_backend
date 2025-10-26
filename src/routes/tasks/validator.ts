import { body } from "express-validator";

export const taskValidation = [
  body("title")
  .notEmpty().withMessage("Title is required")
  .isString().withMessage("Title must be a string")
  .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long")
  .matches(/^[A-Za-z\s]+$/).withMessage("Title must contain only alphabets and spaces")
  .trim()
  .escape(),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description can be at most 500 characters long")
    .trim()
    .escape(),
];



export default {
  taskValidation
}
