# API-template
![Lint](https://github.com/LeChatErrant/API-template/workflows/Lint/badge.svg)
![Tests](https://github.com/LeChatErrant/API-template/workflows/Tests/badge.svg)
![Integration tests](https://github.com/LeChatErrant/API-template/workflows/Integration%20tests/badge.svg)
![Dependabot](https://flat.badgen.net/dependabot/thepracticaldev/dev.to?icon=dependabot)
![Mergify](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/LeChatErrant/API-template)

Simple typescript server template

### Notes

Simple typescript server template to easily start a new project

The purpose of this template is to provide a typesafe production ready webserver and a fully setup dev-environment with the most possible tooling

## Architecture

![Architecture](/.github/assets/topology.png)

## Configuration

Application is configured through *environment variables*

##### Modes

The environment variable `MODE` can be set either to *local*, *dev*, or *prod*

 * Local mode is used for local development. It will use development database (at *localhost:5432*) and is using local storage for sessions
 * Dev mode is used for 'dev' stage. It will use database on *db:5432* and is using redis storage for sessions
 * Prod mode is used for 'production' stage. It will use database on *db:5432*, is using redis storage for sessions, is not writting logs to standard output and uses secured cookies

## Development environment

The template comes with a nicely configured development environment

##### Configuration

Pre-configured environment variables are available in the [.envrc](/.envrc) file. Use it to configure your application during development

.envrc files are automatically loaded by [direnv](https://direnv.net/). I strongly recommand installing it along with its shell hook, to have an isolated development environment

> Even environment variables are typed and validated thanks to [env-var](https://www.npmjs.com/package/env-var)

##### Database

You can run a simple development database by running `npm run dev:db`

It will launch a single local database exposed on port `5432`

##### Local mode

During development, simply run `npm run dev` to launch dev mode (don't forget to set `MODE` at *local*)

It will continuously watch your files to reload the API as you code, and will even regenerate the ORM on schema's changes!

> Dev mode is configured to use the dev database by default
>
> Local storage is used for sessions when `MODE` is set at *local*, so you don't even need to launch redis

##### Prisma studio

You can access and edit your database in a web interface by running `npm run db:studio`

![Prisma studio](.github/assets/studio.png)

## Deployed mode

The whole stack is launched with *docker-compose*

To launch in deployed mode, don't forget to change the environment variable `MODE` to *dev* or *prod*

Run `docker-compose up --build` to launch redis, the database and the API, connected altogether

> Notice that your database is made persistent through a docker volume

## Language

The API is written in [typescript](https://www.typescriptlang.org/)

It benefits from the javascript ecosystem, but help to scale large codebase with a strong typing, and avoid many runtime errors

It is configured through [tsconfig.json](/tsconfig.json)

## Database

The database used is [postgreSQL](https://www.postgresql.org/)

It's stable, maintained, used everywhere, and will fit 99% of the usecases

It's generally seen as the most advanced SQL databse

## ORM

An ORM (Object Relational Mapping) is used to abstract communication with the database, and to avoid security issues

I choosed [Prisma](https://www.prisma.io/), which is in my mind the most convenient ORM among all

It guaranties type safety from your database model, is very-well designed, and comes along with a great documentation and useful tooling (such as automatic migrations or web database editor).

##### Schema

With Prisma, schema is written in PSL (Prisma Schema Language). It makes you model pretty straightforward

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}

model User {
  id        String   @default(cuid()) @id
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
}

enum Role {
  USER
  ADMIN
}
```

##### Generation

Prisma is a generated ORM.

Each time you modify the [schema.prisma](/prisma/schema.prisma), you need to regenerate your ORM (to get new types for example)

It can be achieved through `npm run generate`

> Notice that launching the dev mode will watch for any changed to reload the ORM automatically
>
> You won't need to execute `npm run generate` manually, even in production mode

| ![Prisma client](https://i.imgur.com/aRJmVFY.png) |
|---|
| *Client workflow from [prisma documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/generating-prisma-client)* |

##### Migrations

Changing your database model is not changing what's in your database. That's why you need *migrations*

Migrations describe changes in your database.

Generate it with `npm run db:migrate` once you're satisfied with your new model
> It will be generated in [prisma/migration](/prisma/migrations)

Once generated, apply it on your database with `npm run db:up`
> Be careful! It's not automated as it is a potentially *destructive* operation (eg: removing user table)

| ![Prisma migrations](https://i.imgur.com/OImder6.png) |
|---|
| *Migration workflow from [prisma documentation](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-migrate)* |

> `npm run db` will generate **and** apply migrations in once

## Linter

Code styling is handled by [eslint](https://eslint.org/)

We're using the AirBnb configuration (the most used one), extended for typescript. It will ensure coherence across the whole codebase, and make sure you're following general good practices

You can run the linter manually and fix errors with `npm run lint`

## Testing policy

> Coming soon

## Continuous integration

Every modification in the codebase is controlled with *continuous integration*.

Linter, unitary tests and integration tests are executed automatically at each commit to ensure code quality and avoid regressions

![Pipeline](/.github/assets/pipeline.png)

## Automated dependencies updates

All dependencies are maintained up-to-date automatically, and the continuous integration checks for breaking update

It means
 * All last features are always available
 * All security issues will be fixed as soon as possible, maintaining a cleaner `npm audit`

![Dependency update](/.github/assets/dependabot.png)

## Containerization

The template comes with a [*Dockerfile*](/Dockerfile) and a [*docker-compose.yml*](/docker-compose.yml)

##### Services

Docker-compose launches 3 services:
 * Database
 * Redis
 * Application

##### Persistence

It creates a binded mount on logs directory to make logs persistent adn available from outside the container

It creates a volume on `/var/lib/postgresql/data` to make database storage persistent

##### Security

Database and redis are not exposed to the world directly and are made reachable from the application thanks to docker sub network

Database and redis are secured with password and

The application is not running as `root` user inside the docker

## Logger

The application comes with a custom logger made with [winston](https://www.npmjs.com/package/winston).

It allows you to output nicely formated logs as simply as `logger.info('Server listening on 8000')`

Error logs are written into logs/error.log, and a mix of all logs level from info are written into logs/all.log

In production mode, logs are written in `stdout`, only in files
> This is essential as console.log is a blocking operation
>
> It reduces the IO usage too

The route logger middleware [morgan](https://www.npmjs.com/package/morgan) is integrated too, and is automatically logging all responses from the server

![Logs](/.github/assets/logger.png)

## Documentation

##### Swagger

> Coming soon

##### Postman

A [postman collection](/App.postman_collection.json) is available to test application routes

## Error handling

##### Error responses

All errors from the app are catched with an *error middleware*, and forwarded to the user.

This middleware catch [http-errors](https://www.npmjs.com/package/http-errors), so you can safely throw in your routes using this module

> eg: Simply write `throw createError(401, 'You must be logged in')` to reply with a `401` response

Any unknown errors are logged on `stdout` (to give hints to developers) and are converted into a `500` response

##### Async handler

Express doesn't handle errors thrown in an async context. It means that even with an error middleware, errors won't be catched if they are thrown from an async handler

To avoid this problem, all handler are wrapped in an [express-async-handler](https://www.npmjs.com/package/express-async-handler)

```javascript
router.post('/signin', handler(async (req, res) => {
  /*  Route code here */
}));
```

##### Not found

A middleware handling not found routes is present, formatting a NotFound error passed the the error middleware, as every other errors

##### Unhandled errors

It happens to have some left unhandled promise rejections or uncaught exceptions

Don't worry, your application won't crash : they are handled too and are logged to `stdout`

## User management

The template comes with basic user management logic

##### Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/users` | User list |
|---|---|---|
| `POST` | `/users/signup` | Signup |
|---|---|---|
| `POST` | `/users/signin` | Signin |
|---|---|---|
| `GET` | `/users/:id` | User information |
|---|---|---|
| `PATCH` | `/users/:id` | Update user |
|---|---|---|
| `DELETE` | `/users/:id` | Delete user |
|---|---|---|

##### Security

Passwords are stored hashed in the database. The algorithm in use is [argon2](https://www.npmjs.com/package/argon2)

Passwords need to have a length of at least 8 bytes

##### Route protection

Some routes need the user to be logged

You can protect such routes with the *authMiddleware*

```javascript
router.get('/some-confidential-informations', authMiddleware, handler(async (req, res) => {
  /*  Here, you are sure the user is logged */
}));
```

There is an other middleware to do some more advanced checking : the *userMiddleware*

The *userMiddleware* is used to protect routes accessing specific user resources. It :
 * Make sure the user is logged in
 * Make sure `userId` is present in the URL (eg: `GET` `/users/:userId/someResource`)
 * Make sure the `userId` is the id of the current user **or** that the user is admin
 * Allow using *me* as `userId` (eg: `GET` `/users/me/someResource`)

> You can compose middlewares thanks to the [compose-middleware](https://www.npmjs.com/package/compose-middleware) module.
>
> It allows you some fancy syntax such as `export default compose([authMiddleware, userMiddleware]);`
>
> Here, I make sure the used is logged **before** checking who he is by reusing the authMiddleware

## Role system

##### Roles

The template has a *role* system

Two roles are available :
 * USER
 * ADMIN

When a new user signup, he is attributed the role of *USER*

*ADMIN* can access other user resources and some private routes

For example, the `GET` `/users` route to list all users (useful for monitoring or to create an admin console) is not available for a *USER* but is available for an *ADMIN*

##### Route protection

You can make a route accessible only by an *ADMIN* with the *adminMiddleware*. Admin middleware ensure the user is logged in and got the *ADMIN* role

```javascript
router.get('/users', adminMiddleware, handler(async (req, res) => {
  /*  Here, you are sure the user got ADMIN role  */
}));
```

## Request validation

Requests body parameters are validated thanks to [class-validator](https://www.npmjs.com/package/class-validator)

Simply define the DTO (Data Transfer Object) schema for your route

```typescript
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
```

Then, you can validate incoming DTOs thanks to *validationMiddleware* and type your controllers

```typescript
async function signupController(payload: UserSignupDto) {
  /*  Signup logic, with typed payload  */
}

router.get('/users/signup', validate(UserSignupDto), handler(async (req, res) => {
  /*  Here, you are sure all constraints from your DTO are respected. You can safely pass it to your controller */
  await signupController(req.body);
}));
```

### Contributors

![GitHub Logo](https://github.com/LeChatErrant.png?size=30) &nbsp; [LeChatErrant](https://github.com/LeChatErrant) - creator and maintainer
