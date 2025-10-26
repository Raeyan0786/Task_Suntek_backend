import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const buildError = (
  message: string = "An Error Occured!",
  statusCode: number = 500,
  data: any = null,
  status: boolean = false
) => {
  let err: any = new Error(message);
  err.statusCode = statusCode;
  err.status = status;
  err.data = data;

  return err as Error | any;
};

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    throw buildError(errors.array()[0].msg, 400, errors.array());

  next();
};


