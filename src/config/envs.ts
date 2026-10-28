import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().positive(),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  JWT_SEED: z.string(),
  MAILER_SERVICE: z.string(),
  MAILER_EMAIL: z.email(),
  MAILER_SECRET_KEY: z.string(),
  WEBSERVICE_URL: z.string(),
  SEND_EMAIL: z.coerce.boolean()
})

export const envs = envSchema.parse(process.env);