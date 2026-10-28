import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

export interface ValidatedRequest<
    Body = unknown,
    Params = ParamsDictionary,
    ReqQuery = Query,
> extends Request<Params, unknown, Body, ReqQuery> { }

export type ValidatedHandler<
    Body = unknown,
    Params = ParamsDictionary,
    ReqQuery = Query,
> = (
    req: ValidatedRequest<Body, Params, ReqQuery>,
    res: Response,
    next: NextFunction,
) => unknown;
