import { z } from 'zod';
import type { RegisterUserDTO } from '../../../domain/dto/auth';
import { LoginUserDTO } from '../../../domain/dto/auth/login-user.dto';

export const registerUserSchema = z.toZod<RegisterUserDTO>()(z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6)
}));

export const loginUserSchema = z.toZod<LoginUserDTO>()(z.object({
    email: z.email(),
    password: z.string().min(6)
}))