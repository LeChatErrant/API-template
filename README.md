# API-template
![Lint](https://github.com/LeChatErrant/API-template/workflows/Lint/badge.svg)
![Unit tests](https://github.com/LeChatErrant/API-template/workflows/Unit%20tests/badge.svg)
![Integration tests](https://github.com/LeChatErrant/API-template/workflows/Integration%20tests/badge.svg)

# What is it ?

 - [x] **Decisions** are already made
 - [x] **Configurations** are already written
 - [x] **CI / CD** pipelines are running
 - [x] **Development** environment is configured
 - [x] **[CLI](https://github.com/LeChatErrant/lantern)** adds new routes
 - [x] **[Frontend](https://github.com/LeChatErrant/front-template)** is available
 - [x] **[Deployment](https://github.com/LeChatErrant/ops-template)** is ready
 - [x] **Focus on what matters : *code***

&nbsp;

The goal of this project is to provide a **typesafe**, **production ready** modern web API template along with a full **development environment**.

It gives your project a clean base to start and follows development **good practices**, essentially focusing on **maintainability** and **extensibility**

Lastly, it aims to save developers a lot of time since all **nasty configurations** are already written (typescript, eslint, jest, docker, CI, ...) and **technologies** are already chosen (language, testing framework, database, ORM, ...)

&nbsp;

| ![Template](.github/assets/template.gif)                                                                                                                               |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| This repository is **templated**. Use it as a base for your own projects by clicking on **[Use this template](https://github.com/LeChatErrant/API-template/generate)** |

&nbsp;

**[API-template](https://github.com/LeChatErrant/API-template)** is fully integrated with
- **[front-template](https://github.com/LeChatErrant/front-template)**, a modern typescript frontend stack
- **[ops-template](https://github.com/LeChatErrant/ops-template)**, a complete scalable infrastructure on Kubernetes
- **[lantern](https://github.com/LeChatErrant/lantern)**, a CLI to assist backend development

> Don't hesitate to share your improvements or to give feedback on Discord **(LeChatErrant#6074)** :wink:


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Table of contents

- [Documentation](#documentation)
- [Deployment](#deployment)
- [Getting started](#getting-started)
- [Technologies](#technologies)
- [CLI](#cli)
- [Roadmap](#roadmap)
- [How to contribute](#how-to-contribute)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Documentation

Documentation can be found in the **[wiki](https://github.com/LeChatErrant/API-template/wiki)**

# Deployment

API is automatically deployed on **[Heroku](https://www.heroku.com)** and can be reached on **[api-template-prod.herokuapp.com](https://api-template-prod.herokuapp.com)**

For a complete production deployment, see **[ops-template](https://github.com/LeChatErrant/ops-template)**

> Additionally, you can try out the API **[here, on Postman](https://www.postman.com/LeChatErrant/workspace/api-template)**

# Getting started

1. Make sure the **[.envrc](/.envrc)** is loaded (have a look **[here](https://github.com/LeChatErrant/API-template/wiki/Getting-started#Configuration)**)
2. Install dependencies with `npm install`
3. Launch a local database with `npm run dev:db`
4. Run `npm run dev`

![Deployment example](.github/assets/deployment.gif)

# Technologies

 - **[Typescript](https://www.typescriptlang.org/)** : Language
 - **[Express](https://expressjs.com/)** : Web server
 - **[Heroku](https://www.heroku.com)** : Application hosting
 - **[Prisma](https://www.prisma.io/)** : ORM
 - **[Prisma studio](https://www.prisma.io/studio)** : Database visualisation
 - **[Prisma migrate](https://www.prisma.io/migrate)** : Database migration
 - **[Prisma data platform](https://www.prisma.io/dataplatform)** : Database hosting
 - **[Bcrypt](https://www.npmjs.com/package/bcrypt)** : Password hashing
 - **[Eslint](https://eslint.org/)** : Code styling
 - **[Jest](https://jestjs.io/)** : Testing
 - **[Supertest](https://www.npmjs.com/package/supertest)** : Endpoint testing
 - **[Class validator](https://github.com/typestack/class-validator)** : DTO validation
 - **[Winston](https://github.com/winstonjs/winston)** : Logger
 - **[Husky](https://typicode.github.io/husky/#/)** : Pre commit hooks
 - **[GitHub action](https://github.com/features/actions)** : CI / CD
 - **[Docker](https://www.docker.com/)** : Containerization
 - **[Redis](https://redis.io/)** : Session management
 - **[PostgreSQL](https://www.postgresql.org/)** : Database

...and more

# CLI

The template comes with a **[Command-Line Interface](https://github.com/LeChatErrant/lantern)** that helps you to **initialize**, **develop** and **maintain** your projects. It saves you from writing boilerplate code 

> The CLI is currently under heavy development, new features will be release soon ❤️
> 
> More details in **[wiki](https://github.com/LeChatErrant/API-template/wiki/CLI)**

![CLI - Generate](.github/assets/cli-generate.gif)

# Roadmap

 - [ ] CLI to create, extend and manage API resources
 - [ ] Auto generated code documentation
 - [ ] Integration with Prisma seeders
 - [ ] Back office template

# How to contribute

1. Fork it (**<https://github.com/LeChatErrant/API-template/fork>**)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

Issues and comments welcomed ! :wink:

## Contributors

![GitHub Logo](https://github.com/LeChatErrant.png?size=30) &nbsp; **[LeChatErrant](https://github.com/LeChatErrant)** - creator and maintainer
