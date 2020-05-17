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

## Installation

Run `npm install`

## Configuration

Configuration of the application is done through environment variables, in the .envrc at the root of the repository

For development, I'm using [direnv](https://direnv.net/), which will load the .envrc automaticaly and will let you freely overrides environment variables

## Generate migrations

Run `npm run db:migrate`

## Apply migrations

Run `npm run db:up`

> Note that `npm run db` will migrate and apply migrations, all at once

## Dev mode

You can start a local database with `npm run dev:db`

`npm run dev` will generate the orm, start the server, and watch for any changes. That all you need

## Lint

Run `npm run lint`
