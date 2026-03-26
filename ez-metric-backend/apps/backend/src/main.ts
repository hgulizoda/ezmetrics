import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { TransformResponseInterceptor } from './common/interceptors/response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      credentials: true,
      origin: true,
    },
  })

  const config_service = app.get<ConfigService>(ConfigService)
  const api_prefix = config_service.get<string>('api_prefix') || 'api'
  const port = config_service.get<number>('port') || 3001

  app.setGlobalPrefix(api_prefix)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.useGlobalInterceptors(new TransformResponseInterceptor())

  const swagger_config = new DocumentBuilder()
    .setTitle('EZ Metric API')
    .setDescription('Workforce Time Tracking & Payroll API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger_config)
  SwaggerModule.setup(`${api_prefix}/docs`, app, document)

  await app.listen(port)
}
bootstrap()
