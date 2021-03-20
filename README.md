# API-template
![Lint](https://github.com/LeChatErrant/API-template/workflows/Lint/badge.svg)
![Unit tests](https://github.com/LeChatErrant/API-template/workflows/Unit%20tests/badge.svg)
![Integration tests](https://github.com/LeChatErrant/API-template/workflows/Integration%20tests/badge.svg)
![Dependabot](https://badgen.net/dependabot/LeChatErrant/API-template?icon=dependabot)
![Mergify](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/LeChatErrant/API-template)

# What is it ?

The purpose of this template is to provide a **typesafe**, **production ready** web API, and a full **development environment** with the best tooling possible

It gives your project a clean base to start and follows development **good practices**, essentially focusing on **maintenability** and **extensibility**

Lastly, it aims to save developers a lot of time since all **nasty configurations** are already written (typescript, eslint, jest, docker, CI, ...) and **technologies** are already chosen (language, testing framework, database, ORM, ...)

> This project is fully integrated with [devops-template](https://github.com/LeChatErrant/devops-template) **(work still in progress)**, which provide a full infrastructure on Kubernetes along with its tooling

Don't hesitate to share your improvements or to give me feedback on Discord at LeChatErrant#6074 :wink:

![Deployment example](https://github.com/LeChatErrant/API-template/blob/master/.github/assets/deployment.gif)

# Table of contents

<!-- START doctoc -->
<!-- END doctoc -->

> First of all, hello. I'm [LeChatErrant](https://github.com/LeChatErrant), software engineer studying at Epitech Paris, creator and maintainer of [API-template](https://github.com/LeChatErrant/API-template)
>
> I'm currently working at [Tresorio](https://tresorio.com/), a green cloud-computing startup, at the position of lead-developer of the cloud-rendering branch (distributed computing for 3D animation)
>
> Passionate by the design of backend software and distributed systems, I'm aiming to offer tools to help building the most complete architecture possible

# Getting started

1. Make sure the [.envrc](/.envrc) is loaded (have a look [here](wip))
2. If no database is running, simply launch one locally with `npm run dev:db`
3. Run `npm run dev`

# How to reuse this template

This repository is **templated** : try using it as a base for your own projects by clicking on the **[Use this template](https://github.com/LeChatErrant/API-template/generate)**

![Template](/.github/assets/template.gif)

# Guide

Documentation can be found on the [wiki](https://github.com/LeChatErrant/API-template/wiki)

# Work in progress

 - [ ] CLI to create, extend and manage API resources
 - [ ] Unit tests
 - [ ] Auto generated code documentation
 - [ ] Integration with Prisma seeders
 - [ ] Back office template

# How to contribute

1. Fork it (<https://github.com/LeChatErrant/API-template/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

Issues and comments welcomed ! :wink:

## Contributors

![GitHub Logo](https://github.com/LeChatErrant.png?size=30) &nbsp; [LeChatErrant](https://github.com/LeChatErrant) - creator and maintainer
