import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { envs } from './envs';
import { ZodJWT } from 'zod';

export class JWTGenerator {
    static async generateToken(payload: string | object, duration: number = 2 * 60 * 60) {
        return new Promise(resolve => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token)
            })
        })
    };

    static validateToken<T extends JwtPayload>(token: string): Promise<T | null> {
        return new Promise(resolve => {
            jwt.verify(token, envs.JWT_SEED, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded as T);
            });
        })
    }
}