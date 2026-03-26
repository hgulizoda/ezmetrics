import { NestFactory } from '@nestjs/core'

import { QueueAppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(QueueAppModule)
  await app.listen(3003)
}
bootstrap()
