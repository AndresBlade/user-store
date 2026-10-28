import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { z } from 'zod';
import { validate } from './validate';
import type { ValidatedHandler, ValidatedRequest } from '../types/validated-request';

interface ValidatedRouteOptions<B, P, Q> {
    body?: z.ZodType<B>;
    params?: z.ZodType<P>;
    query?: z.ZodType<Q>;

    // NoInfer evita que B/P/Q se infieran desde el handler:
    // solo pueden venir de los schemas.
    handler: ValidatedHandler<NoInfer<B>, NoInfer<P>, NoInfer<Q>>;
}

export function validatedRoute<B = unknown, P = ParamsDictionary, Q = Query>(
    options: ValidatedRouteOptions<B, P, Q>,
): RequestHandler[] {
    // Única conversión de tipos: el orden de los middlewares de abajo
    // garantiza que las partes validadas ya existen en la request.
    const handler: RequestHandler = (req, res, next) =>
        options.handler(req as unknown as ValidatedRequest<B, P, Q>, res, next);

    return [
        validate({
            body: options.body,
            params: options.params,
            query: options.query,
        }),
        handler,
    ];
}
