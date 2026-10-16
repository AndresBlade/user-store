import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JWTGenerator {
    static async generateToken(payload: string | object, duration: number = 2 * 60 * 60) {
        return new Promise(resolve => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token)
            })
        })
    }

    static validateToken(token: string): unknown {
        throw new Error('Not implemented');
    }
}