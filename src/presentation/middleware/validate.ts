import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

type RequestPart = 'body' | 'params' | 'query';

export type RequestSchemas = Partial<Record<RequestPart, z.ZodType>>;

export function validate(schemas: RequestSchemas) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validated: Partial<Record<RequestPart, unknown>> = {};

        // Las partes se validan en el orden en que se declaran.
        for (const part of Object.keys(schemas) as RequestPart[]) {
            const schema = schemas[part];
            if (!schema) continue;

            try {
                validated[part] = schema.parse(req[part]);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return res.status(400).json({
                        error: "Validation failed",
                        source: part,
                        details: error.issues
                    });
                }
                return next(error);
            }
        }

        // Solo se muta la request si todas las partes pasaron la validación.
        if (schemas.body) req.body = validated.body;
        if (schemas.params) req.params = validated.params as typeof req.params;
        if (schemas.query) {
            // Express 5 define req.query como getter: no se puede asignar directo.
            Object.defineProperty(req, 'query', {
                value: validated.query,
                configurable: true,
                enumerable: true,
                writable: true
            });
        }

        next();
    };
}
