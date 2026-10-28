import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import type { AuthUser } from './auth-user';

export interface AuthenticatedRequest<
    Body = unknown,
    Params = ParamsDictionary,
    ReqQuery = Query,
> extends Request<Params, unknown, Body, ReqQuery> {
    user: AuthUser;
}

export type AuthenticatedHandler<
    Body = unknown,
    Params = ParamsDictionary,
    ReqQuery = Query,
> = (
    req: AuthenticatedRequest<Body, Params, ReqQuery>,
    res: Response,
    next: NextFunction,
) => unknown;
