# Backend Architecture Rules

This document captures the backend architecture and implementation style used in `mock-ielts-backend`.

Use it when building or reviewing another NestJS backend that should follow the same structure. Favor these rules over generic NestJS defaults unless the target repository already has a stronger, established convention.

## Goal

Build backends with these properties:

- feature-first module structure
- shared domain layer reused across multiple apps
- thin controllers, business logic in services
- Mongoose schemas as the main persistence contract
- consistent DTO validation and response serialization
- queue-driven background processing for expensive work

## Repository Shape

The source project is a monorepo with three apps:

- `apps/backend`: public/client-facing API and the main source of shared backend code
- `apps/admin`: admin API that reuses backend models, DTOs, utilities, and some services
- `apps/queue`: background workers and Bull processors

Shared code should live in `apps/backend/src` and be imported into `admin` and `queue` when possible.

Use this structure:

```text
apps/
  backend/
    src/
      api/
        <feature>/
          dto/
          <feature>.controller.ts
          <feature>.service.ts
          <feature>.module.ts
          <feature>-service.module.ts
      common/
      constants/
      middlewares/
      models/
      services/
  admin/
    src/
      api/
        <feature>/
  queue/
    src/
      queues/
        <queue-name>/
```

## Core Architecture Rules

### 1. Keep domain ownership in `backend`

- Put schemas, enums, shared decorators, interceptors, errors, utilities, and reusable services in `apps/backend/src`.
- `admin` and `queue` should import shared backend code instead of redefining the same domain types.
- Duplicate code only when the behavior is truly app-specific.

### 2. Use feature-first modules

Each feature lives under `apps/<app>/src/api/<feature>`.

A standard feature contains:

- `dto/` for request and response DTOs
- `<feature>.controller.ts` for HTTP endpoints
- `<feature>.service.ts` for business logic
- `<feature>.module.ts` for controller wiring
- `<feature>-service.module.ts` when the service must be imported by other modules or apps

Recommended blueprint:

```text
api/organization/
  dto/
    create.dto.ts
    update.dto.ts
    response.dto.ts
  organization.controller.ts
  organization.service.ts
  organization.module.ts
  organization-service.module.ts
```

### 3. Separate transport wiring from business logic

- Controllers should validate input, call services, and shape the response.
- Services should contain business rules, persistence queries, orchestration, and cross-feature coordination.
- Controllers must stay thin. Avoid embedding database logic or queue logic directly in controllers unless it is a single delegation call.

### 4. Reuse `BaseService` for standard CRUD behavior

If a feature is backed by a Mongoose model and mostly needs standard CRUD operations:

- extend `BaseService<T>`
- inject the model with `@InjectModel(...)`
- call `super(model)` in the constructor
- add only feature-specific behavior in the concrete service

## Module Conventions

Follow the two-module split used heavily in this repo:

- `<feature>.module.ts`: imports the service module, declares controllers, exports the service module when needed
- `<feature>-service.module.ts`: registers Mongoose models and providers, exports the service

Use `forwardRef()` only when there is a real circular dependency, such as service-to-service or service-to-queue relationships.

Make modules `@Global()` only when the service is intentionally app-wide infrastructure, not just for convenience.

## Model and Persistence Rules

Define persistence models with `@Schema()` classes in `apps/backend/src/models`.

Follow these conventions:

- use `SchemaFactory.createForClass(...)`
- use `COLLECTION_TIMESTAMPS` so timestamps are stored as `created_at` and `updated_at`
- use explicit `collection` names
- export a typed document alias with `MongooseDocument<T>` when appropriate
- use enums for constrained string values
- use `deleted_at` for soft-delete capable entities instead of inventing per-model delete flags

Typical schema pattern:

```ts
@Schema({
  timestamps: COLLECTION_TIMESTAMPS,
  collection: 'organizations',
})
export class Organization {
  @Prop()
  name: string

  @Prop({ required: true, unique: true })
  tenant_id: string

  @Prop()
  deleted_at?: Date
}

export type OrganizationDocument = MongooseDocument<Organization>
export const OrganizationSchema = SchemaFactory.createForClass(Organization)
```

## DTO Rules

DTOs are part of the architecture, not optional polish.

For request DTOs:

- place them in `dto/`
- use `class-validator`
- use `class-transformer` `@Type()` for nested DTOs
- prefer explicit DTO classes like `CreateOrganizationDTO`, `UpdateExamDTO`, `SaveAnswersDTO`

For response DTOs:

- create dedicated `*ResponseDTO` classes
- use `@Expose()` for every field that should leave the API
- use explicit transforms like `transform_object_id()` when needed
- do not return raw Mongoose documents as the public response contract

## HTTP and Response Rules

HTTP apps in this architecture should use:

- global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`
- global `TransformResponseInterceptor`
- Swagger setup driven by generated metadata

Controller response shape should stay consistent:

- return `{ data }` for single resources
- return `{ data, total }` for list endpoints
- optionally include `{ message }` for action endpoints

Prefer the custom response decorator pattern:

- annotate handlers with `@ResponseDTO(...)`
- let the interceptor serialize `data`

This keeps controller code small and response contracts explicit.

## Auth and Request Context Rules

This backend style expects auth and request metadata to be centralized.

Use patterns like:

- `@Public()` for unauthenticated endpoints
- `@User()` to access the authenticated user
- `@GetClientType()` when behavior changes by client type
- `@GetContext()` for pagination and shared request context

Avoid manually parsing pagination and auth details in every controller.

## Queue Architecture Rules

Background work belongs in `apps/queue`.

Follow this pattern:

- create a queue wrapper class that exposes typed methods like `check_exam_submission(...)`
- define queue names and event names as constants or enums
- create a processor with `@Processor(...)`
- extend `BaseProcessor` for shared job logging
- keep processors focused on orchestration and delegation
- keep expensive analysis logic in dedicated services when possible

Queue payloads should be typed and small. Prefer IDs over full documents.

## Shared Utilities and Cross-Cutting Code

Put reusable infrastructure in these locations:

- `common/decarators`: parameter and metadata decorators
- `common/interceptors`: response shaping
- `common/errors`: custom API error types
- `common/enums`: shared enums
- `common/utils`: query helpers, transforms, response wrappers
- `middlewares`: request logging and app-level middleware
- `constants`: reusable constants and shared types

If something is reused by more than one feature or app, it belongs in shared code instead of inside a single feature folder.

## Naming Conventions

Match the style of this codebase:

- classes, enums, DTO types, and modules: `PascalCase`
- files: `kebab-case`
- database fields and many service variables: `snake_case`
- API field names should usually match persistence field names instead of being translated to camelCase

Examples from the source project:

- `tenant_id`
- `organization_service`
- `created_at`
- `updated_at`

For a new greenfield project, keep the architecture and naming intent, but you do not need to repeat historical spelling mistakes from this repo such as `decarators` or `balande-service.module.ts`.

## Service Design Rules

Services should:

- encapsulate model access
- enforce business invariants
- throw typed application errors
- coordinate with other services and queues
- keep method names explicit and domain-focused

Prefer methods like:

- `create_organization`
- `add_member`
- `create_user_session`
- `update_overall_results`

Avoid vague names like `handle`, `processData`, or `run`.

## Error Handling Rules

Prefer explicit error classes with stable payloads.

Use custom errors for common cases such as:

- not found
- already exists
- bad request
- unauthorized

Do not scatter ad hoc error response formats across controllers and services.

## Configuration Rules

Centralize environment parsing in a config module:

- define a single Joi validation schema
- expose nested config values from a `configuration()` function
- inject `ConfigService` where values are needed

All new environment variables should be added to the central config definition instead of being read directly from `process.env` across the codebase.

## AI Agent Instructions

When generating code for a backend that should follow this architecture:

- prefer this structure over a default CRUD Nest generator layout
- create feature folders under `api/<feature>`
- add DTOs even for simple endpoints
- use a service module split when the service is reusable
- place shared schemas and infrastructure in the backend shared layer
- keep controllers thin and services responsible for business rules
- use queue wrappers and processors for async jobs
- preserve `created_at`, `updated_at`, and `deleted_at` field conventions
- return the standard `{ data }` or `{ data, total }` envelope
- reuse existing shared code before creating a new abstraction

If the target repository already has a strong architecture, adapt these rules carefully instead of forcing a conflicting rewrite.

## New Feature Checklist

For every new backend feature, verify that you created or considered:

1. a schema in `apps/backend/src/models` if persistence is needed
2. a service that extends `BaseService` when CRUD behavior applies
3. a `*-service.module.ts` if the service will be reused
4. a controller with thin handlers
5. request DTOs with validation
6. response DTOs with `@Expose()`
7. `@ResponseDTO(...)` on controller methods
8. proper imports into the app module
9. shared placement for anything reused by `admin` or `queue`
10. queue integration if the work is async or long-running

## Bottom Line

The important rule is not just "use NestJS." The important rule is:

- organize by feature
- keep shared domain code in the backend layer
- keep controllers thin
- keep services authoritative
- make DTOs and response serialization explicit
- treat queues as first-class architecture
