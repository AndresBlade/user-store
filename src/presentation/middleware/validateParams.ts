import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validateParams<T extends z.ZodType>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.params = schema.parse(req.params) as typeof req.params;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: error.issues
                })
            }
            next(error);
        }
    }
}
