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

# S*OpenAPI Access Management

## Purpose

> API Access Authorization Management: users, roles, server api keys &amp; CORS.

## Endpoints

Import [endpoints.json][sopenapi-endpoint] into postman or see our [e2e testing][sopenapi-e2e]

## Security

If you change env value of `APP_MODE` to `secure` that will trigger more `Middleware` and `Guard`.

1. `TimestampMiddleware`, tolerant 5 minutes of request.
2. `UserAgentMiddleware`, whitelist of user agent.
3. `ApiKeyGuard`, check api key based on database.
4. `CorsMiddleware`, check cors based on configs.

## Features

- Authentication and Authorization (OAuth2, API Key, Basic Auth, Role Management)
- MongoDB integration using Mongoose
- Database Migration (NestJs-Command)
- Storage management with Amazon (AWS) or maybe with Internal Storage (Fs)
- Server Side Pagination (3 Types)
- Url Versioning
- Request Validation Pipe with Custom Message
- Custom Error Status Code
- Logger (Morgan) and Debugger (Winston)
- Centralize Configuration
- Centralize Exception Filter, and Custom Error Structure
- Multi-language (i18n)
- Timezone Awareness, and Custom Timezone
- Request Timeout, and Custom Timeout (Override) ⌛️
- Dynamic Setting from Database
- Maintenance Mode on / off
- Cache Manager Implementation, can replace with Redis, Memcached, or anything else
- Support Docker Installation
- Support CI/CD with Github Action or Jenkins
- Husky GitHook For Check Source Code, and Run Test Before Commit
- Linter with EsLint for Typescript

## Todo

Next developments:
- [ ] Swagger doc
- [ ] Versioning Serialization (Low Priority)
- [ ] Update Documentation 
- [ ] Docker Compose File Mongodb Replication Set (Low Priority)

## Documentation

Find more details in the ACK docs:

- [Documentation][ack-nestjs-mongoose-boilerplate-docs]
- [Example][ack-nestjs-mongoose-boilerplate-docs-example]
- [Tips][ack-nestjs-mongoose-boilerplate-docs-tips]

## Credits

This module benefits a lot from the powerful *NestJS* dev framework. It is also largely inspired by the work done by Andre Christi Kan, a.k.a. [ACK](https://github.com/andrechristikan), and the contributors of the template projet [ACK NestJs Boilerplate Mongoose](https://github.com/andrechristikan/ack-nestjs-boilerplate-mongoose) (under MIT license).

We invite every nodejs/nestjs to benefit from this high-ended boilerplate, in terms of code quality, patterns, tests, deployments & documentations!

## License

Distributed under the [MIT license][license].


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
[sopenapi-e2e]: /e2e
[sopenapi-endpoint]: /endpoints/endpoints.json

<!-- License -->
[license]: LICENSE.md
[endpoints]: endpoints.json

<!-- Documentations -->
[ack-nestjs-mongoose-boilerplate-docs]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/
[ack-nestjs-mongoose-boilerplate-docs-features]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/features/readme
[ack-nestjs-mongoose-boilerplate-docs-example]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/example
[ack-nestjs-mongoose-boilerplate-docs-tips]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/tips/readme
[ack-nestjs-mongoose-boilerplate-docs-env]: https://andrechristikan.github.io/ack-nestjs-boilerplate-docs/#/features/readme

<!-- References -->
[ref-nestjs]: http://nestjs.com
[ref-mongoose]: https://mongoosejs.com/
[ref-mongodb]: https://docs.mongodb.com/
[ref-nodejs-best-practice]: https://github.com/goldbergyoni/nodebestpractices
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-docker]: https://docs.docker.com
[ref-yarn]: https://yarnpkg.com
[ref-postman-import-export]: https://learning.postman.com/docs/getting-started/importing-and-exporting-data/
