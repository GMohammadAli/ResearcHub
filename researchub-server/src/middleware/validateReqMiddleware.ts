import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({ ...req.body });
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    req.body = result.data;

    next();
  };
};

export default validate;
