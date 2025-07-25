import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema:any) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { 
        abortEarly: false, // Get all errors
        stripUnknown: true // Remove fields not in schema
      });
      next();
    } catch (error:any) {
      return res.status(400).json({
        errors: error.errors // Array of all error messages
      });
    }
  };
};