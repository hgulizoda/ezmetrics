import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { TransformResponseInterceptor } from '@backend/common/interceptors/response.interceptor'

import { AdminAppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AdminAppModule, {
    cors: {
      credentials: true,
      origin: true,
    },
  })

  const config_service = app.get<ConfigService>(ConfigService)
  const port = config_service.get<number>('port') || 3002

  app.setGlobalPrefix('admin-api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalInterceptors(new TransformResponseInterceptor())

  const swagger_config = new DocumentBuilder()
    .setTitle('EZ Metric Admin API')
    .setDescription('Admin API for Workforce Time Tracking & Payroll')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger_config)
  SwaggerModule.setup('admin-api/docs', app, document)

  await app.listen(port)
}
bootstrap()
