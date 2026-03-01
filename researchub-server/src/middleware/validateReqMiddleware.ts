import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

const validate = (
  schema: ZodType,
  source: "body" | "params" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error,
      });
    }
    req[source] = result.data;

    next();
  };
};

export default validate;
