import * as Joi from 'joi'

export const validation_schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3001),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
  API_PREFIX: Joi.string().default('api'),
  TELEGRAM_BOT_TOKEN: Joi.string().optional().allow(''),
  ADMIN_EMAIL: Joi.string().optional().allow(''),
  REDIS_HOST: Joi.string().optional().default('localhost'),
  REDIS_PORT: Joi.number().optional().default(6379),
})

export const configuration = () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  api_prefix: process.env.API_PREFIX || 'api',
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expiration: process.env.JWT_EXPIRATION || '15m',
    refresh_expiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  telegram: {
    bot_token: process.env.TELEGRAM_BOT_TOKEN,
  },
  admin_email: process.env.ADMIN_EMAIL,
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
})

export default {
  isGlobal: true,
  load: [configuration],
  validationSchema: validation_schema,
  validationOptions: {
    abortEarly: true,
  },
}
