import { body, oneOf, CustomValidator } from "express-validator";

const isStrongPassword: CustomValidator = (value) => {
  if (value.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(value)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(value)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(value)) {
    throw new Error("Password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    throw new Error("Password must contain at least one special character");
  }
  return true;
};

export const userSignupValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(isStrongPassword),
];

export const userSignInValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(isStrongPassword),
];

export default {
  userSignInValidation,
  userSignupValidation,
};

// import { CustomValidator, body, oneOf, param, query } from "express-validator";

// const userLogin: any[] = [
//   oneOf(
//     [
//       body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
//       body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
//     ],
//     "Please enter valid mobile number or email id"
//   ),
// ];

// const userSignup: any[] = [
//   body("name", "Please enter valid name")
//     .exists()
//     .trim()
//     .notEmpty()
//     .isAlpha("en-IN", { ignore: [" ", "."] }),
//   oneOf(
//     [
//       body("emailOrMobile").exists().trim().notEmpty().isMobilePhone("en-IN"),
//       body("emailOrMobile").exists().trim().notEmpty().isEmail().normalizeEmail(),
//     ],
//     "Please enter valid mobile number or email id"
//   ),
// ];
