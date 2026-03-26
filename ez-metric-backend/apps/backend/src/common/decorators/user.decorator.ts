import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
  },
)
