import { z } from 'zod';
import { PaginationDTO } from '../../../domain/dto/shared/pagination.dto';

export const PaginationSchema = z.toZod<PaginationDTO>()(z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
}));