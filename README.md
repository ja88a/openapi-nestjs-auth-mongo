<!-- 
[![Contributors][sopenapi-contributors-shield]][sopenapi-contributors]
[![Forks][sopenapi-forks-shield]][sopenapi-forks]
[![Stargazers][sopenapi-stars-shield]][sopenapi-stars]
[![Issues][sopenapi-issues-shield]][sopenapi-issues]
[![MIT License][sopenapi-license-shield]][license]
-->

[![NestJs][nestjs-shield]][ref-nestjs]
[![NodeJs][nodejs-shield]][ref-nodejs]
[![Typescript][typescript-shield]][ref-typescript]
[![MongoDB][mongodb-shield]][ref-mongodb]
[![JWT][jwt-shield]][ref-jwt]
[![Jest][jest-shield]][ref-jest]
[![Yarn][yarn-shield]][ref-yarn]
[![Docker][docker-shield]][ref-docker]

# S*OpenAPI

## Purpose

> A set of Set of NestJs API Services for Restful API Microservice

Made with following best practices:
- [nodejs-best-practice](https://github.com/goldbergyoni/nodebestpractices) 
- [The Twelve-Factor App](https://12factor.net)
- [Microservice Architecture](https://microservices.io)
- NestJs Habit.

## Important

> Still on trial phase. Updates, customizations and new features are still required.

You can [Request Feature][sopenapi-issues] or [Report Bug][sopenapi-issues]

## Built With

Describes which version of the main packages and main tools.

| Name                          | Version  |
| ----------                    | -------- |
| [NestJs](ref-nestjs)          | v8.x     |
| [NodeJs](ref-nodejs)          | v17.x    |
| [Typescript](ref-typescript)  | v4.x     |
| [Mongoose](ref-mongoose)      | v6.x     |
| [MongoDB](ref-mongodb)        | v5.x     |
| [Yarn](ref-yarn)              | v1.x     |
| [NPM](ref-npm)                | v8.x     |
| [Docker](ref-docker)          | v20.x    |
| [Docker Compose](ref-docker-compose) | v2.x |


## Local Dev Instructions

### Init your dev environment

```
lerna bootstrap 
lerna link
lerna run build
```
OR
```
make bootstrap
```

### Test

```
lerna run test
```

## Prerequisites

1. Understand [NestJs Fundamental](http://nestjs.com), Main Framework. NodeJs Framework with support fully TypeScript.
2. Understand[Typescript Fundamental](https://www.typescriptlang.org), Programming Language. It will help us to write and read the code.
3. Understand [ExpressJs Fundamental](https://nodejs.org), a NodeJs based Framework. It helps in understanding how the NestJs Framework works.
4. Understand what NoSql is and how it works as a database, especially [MongoDB.](https://docs.mongodb.com)

## Todo

Next developments:
- [ ] Play on the prod MS granularity, via Nestjs composition & gnerated Docker images
- [ ] Configs management across all modules
- [ ] Complete CI/CD of modules using Github actions
- [ ] Integrate Terraform
- [ ] Deploy on Azure Kubernetes Services

## License

Distributed under [MIT licensed][license].


## Contact

[Jabba 01][author-email]

[![Github][github-shield]][author-github]
[![LinkedIn][linkedin-shield]][author-linkedin]

<!-- BADGE LINKS -->
[sopenapi-contributors-shield]: https://img.shields.io/github/contributors/ja88a/openapi-nestjs-auth-mongo?style=for-the-badge
[sopenapi-forks-shield]: https://img.shields.io/github/forks/ja88a/openapi-nestjs-auth-mongo?style=for-the-badge
[sopenapi-stars-shield]: https://img.shields.io/github/stars/ja88a/openapi-nestjs-auth-mongo?style=for-the-badge
[sopenapi-issues-shield]: https://img.shields.io/github/issues/ja88a/openapi-nestjs-auth-mongo?style=for-the-badge
[sopenapi-license-shield]: https://img.shields.io/github/license/ja88a/openapi-nestjs-auth-mongo?style=for-the-badge

[nestjs-shield]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[nodejs-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[mongodb-shield]: https://img.shields.io/badge/MongoDB-white?style=for-the-badge&logo=mongodb&logoColor=4EA94B
[jwt-shield]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[jest-shield]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[yarn-shield]: https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white
[docker-shield]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white

[github-shield]: https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white

<!-- CONTACTS -->
[author-linkedin]: https://linkedin.com/in/srenault
[author-email]: mailto:r0g3r@tuta.io
[author-github]: https://github.com/ja88a

<!-- Repo LINKS -->
[sopenapi-endpoint]: /endpoints/endpoints.json

<!-- license -->
[license]: LICENSE.md
[endpoints]: endpoints.json

<!-- Documents -->
[sopenapi-docs]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/
[sopenapi-docs-features]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/features/readme
[sopenapi-docs-example]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/example
[sopenapi-docs-tips]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/tips/readme
[sopenapi-doc-env]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/features/readme

<!-- Reference -->
[ref-nestjs]: http://nestjs.com
[ref-mongoose]: https://mongoosejs.com/
[ref-mongodb]: https://docs.mongodb.com/
[ref-nodejs-best-practice]: https://github.com/goldbergyoni/nodebestpractices
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-docker]: https://docs.docker.com
[ref-docker-compose]: https://docs.docker.com
[ref-yarn]: https://yarnpkg.com
[ref-postman-import-export]: https://learning.postman.com/docs/getting-started/importing-and-exporting-data/
