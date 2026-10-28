import { Router } from 'express';
import { AuthController } from './controller';
import { validate } from '../../middleware/validate';
import { loginUserSchema, registerUserSchema, validateEmailParamsSchema } from './auth.schemas';
import { AuthService } from './service/auth.service';
import { EmailService } from './service/email.service';
import { envs } from '../../../config';

export class AuthRoutes {


    static get routes(): Router {

        const router = Router();

        const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY, false)
        const authService = new AuthService(emailService);
        const authController = new AuthController(authService);

        // Definir las rutas
        router.post('/login', validate({ body: loginUserSchema }), authController.login);
        router.post('/register', validate({ body: registerUserSchema }), authController.register);
        router.get('/validate-email/:token', validate({ params: validateEmailParamsSchema }), authController.validateEmail);

        return router;
    }
}

