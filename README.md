# typescript-server-template
Simple typescript server template

### Notes

Simple typescript server template to easily start a new project

Comes with : 
 * Typescript configuration
 * Airbnb linter
 * Dockerfile
 * Docker-compose
 * Dev tooling to easily work (see package.json)
 * Environment-based configuration
 * Environment type checking
 * Custom logger, with errors.logs and all.logs saved to files
 * Route logger
 * Sessions stored on redis
 * Postgresql database
 * Prisma ORM
 * Seeders
 * Migrations
 * Error middlewares
 * User management
 * User role system
 * Handling of error throwned in async routes
 * Validation middleware
 * Various middlewares to protect routes (logged, user, admin) and combination logic
 * Unhandled error handling

The purpose of this template is to provide a typesafe production ready webserver and a fully setup dev-environment with the most possible tooling

## Architecture

![Architecture](/.github/assets/topology.png)

## Installation

Run `npm install`

## Configuration

For development, I'm using [direnv](https://direnv.net/). It will load the .envrc at the root of the repository and will let you freely overides environment variables

## Generate migrations

Run `npm run db:migrate`

## Apply migrations

Run `npm run db:up`

> Note that `npm run db` will migrate and apply migrations

## Dev mode

Start local database `npm run dev:db`
Run `npm run dev` will watch for any changes

## Lint

Run `npm run lint`
