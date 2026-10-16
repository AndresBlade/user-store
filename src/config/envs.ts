import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().positive(),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  JWT_SEED: z.string()
})

export const envs = envSchema.parse(process.env);