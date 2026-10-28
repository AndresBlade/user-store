import type { RequestHandler } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { z } from 'zod';
import { AuthMiddleware } from './auth';
import { validate } from './validate';
import type {
    AuthenticatedHandler,
    AuthenticatedRequest,
} from '../types/authenticated-request';

interface AuthenticatedRouteOptions<B, P, Q> {
    body?: z.ZodType<B>;
    params?: z.ZodType<P>;
    query?: z.ZodType<Q>;

    // NoInfer evita que B/P/Q se infieran desde el handler:
    // solo pueden venir de los schemas.
    handler: AuthenticatedHandler<NoInfer<B>, NoInfer<P>, NoInfer<Q>>;
}

export function authenticatedRoute<B = unknown, P = ParamsDictionary, Q = Query>(
    options: AuthenticatedRouteOptions<B, P, Q>,
): RequestHandler[] {
    // Única conversión de tipos del sistema: el orden de los middlewares
    // de abajo garantiza que req.user y las partes validadas ya existen.
    const handler: RequestHandler = (req, res, next) =>
        options.handler(req as unknown as AuthenticatedRequest<B, P, Q>, res, next);

    return [
        AuthMiddleware.validateJwt,
        validate({
            body: options.body,
            params: options.params,
            query: options.query,
        }),
        handler,
    ];
}
