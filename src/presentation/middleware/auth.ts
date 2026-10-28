import { NextFunction, Request, Response } from "express";
import { JWTGenerator } from "../../config";
import { UserModel } from "../../data";
import type { AuthUser } from "../types/auth-user";


export class AuthMiddleware {
    static async validateJwt(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header('Authorization');

        if (!authorization) return res.status(401).json({ error: "No token provided" });
        if (!authorization.startsWith("Bearer ")) return res.status(401).json({ error: "Invalid Bearer token" });

        const token = authorization.split(" ")[1];

        try {
            const payload = await JWTGenerator.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: "Invalid token" });

            const user = await UserModel.findById(payload.id);

            if (!user) return res.status(401).json({ error: 'Invalid token - user' });

            const authUser: AuthUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                emailValidated: user.emailValidated,
                role: user.role
            };

            req.user = authUser;

            return next();
        } catch (error) {
            return next(error);
        }
    }
}