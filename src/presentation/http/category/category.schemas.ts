import { z } from 'zod';
import type { RegisterUserDTO } from '../../../domain/dto/auth';
import { LoginUserDTO } from '../../../domain/dto/auth/login-user.dto';
import { CreateCategoryDTO } from '../../../domain/dto/category/create-category.dto';

export const createCategorySchema = z.toZod<CreateCategoryDTO>()(z.object({
    name: z.string(),
    available: z.boolean().default(false)
}));