import { Request, Response } from 'express';
import { RegisterUserDTO } from '../../../domain/dto';
import { AuthService } from './services/auth.service';
import { CustomError } from '../../../domain';
import { JWTGenerator } from '../../../config';

export class AuthController {
    constructor(
        public readonly authService: AuthService
    ) { }

    private handleError(err: unknown, res: Response) {
        if (err instanceof CustomError) return res.status(err.statusCode).json({ error: err.message });
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

    register = (req: Request<{}, {}, RegisterUserDTO>, res: Response) => {
        this.authService.registerUser(req.body)
            .then(user => res.json(user))
            .catch(error => this.handleError(error, res));
    }

    login = (req: Request, res: Response) => {
        this.authService.loginUser(req.body)
            .then(user => res.json(user))
            .catch(err => this.handleError(err, res))
    }

    validateEmail = async (req: Request<{ token: string }>, res: Response) => {
        try {
            const { token } = req.params;

            const verified = await JWTGenerator.validateToken(token);

            if (!verified) throw CustomError.unauthorized('Invalid or expired token');

            await this.authService.validateEmail(token);

            res.json('Email validated');
        } catch (err) {
            this.handleError(err, res);
        }
    }
}