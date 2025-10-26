import { body } from "express-validator";

export const createTaskValidation = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long")
    .trim()
    .escape(),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description can be at most 500 characters long")
    .trim()
    .escape(),
];

export const updateTaskValidation = [
  body("title")
    .optional()
    .isString().withMessage("Title must be a string")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long")
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
  updateTaskValidation,
  createTaskValidation 
}
