import { Router } from 'express';
import { AuthController } from './controller';
import { validateBody } from '../../middleware/validateBody';
import { validateParams } from '../../middleware/validateParams';
import { loginUserSchema, registerUserSchema, validateEmailParamsSchema } from './auth.schemas';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { envs } from '../../../config';

export class AuthRoutes {


    static get routes(): Router {

        const router = Router();

        const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY)
        const authService = new AuthService(emailService);
        const authController = new AuthController(authService);

        // Definir las rutas
        router.post('/login', validateBody(loginUserSchema), authController.login);
        router.post('/register', validateBody(registerUserSchema), authController.register);
        router.get('/validate-email/:token', validateParams(validateEmailParamsSchema), authController.validateEmail);

        return router;
    }
}

