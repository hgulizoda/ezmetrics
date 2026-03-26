import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

export class AppNotFoundError extends NotFoundException {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} with id ${id} not found` : `${entity} not found`)
  }
}

export class AppAlreadyExistsError extends ConflictException {
  constructor(entity: string, field?: string) {
    super(
      field
        ? `${entity} with this ${field} already exists`
        : `${entity} already exists`,
    )
  }
}

export class AppBadRequestError extends BadRequestException {
  constructor(message: string) {
    super(message)
  }
}

export class AppUnauthorizedError extends UnauthorizedException {
  constructor(message = 'Unauthorized') {
    super(message)
  }
}
