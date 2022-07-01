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

> API Service exposing Sales data.

## Endpoints

Import [endpoints.json][sopenapi-endpoint] into Postman or see [e2e testing][sopenapi-e2e].

A Swagger/OpenAPI (OAS3) Web API web doc is available at ``/api/sales/v1`` if you enable ``APP_SWAGGER_ON`` from the `.env` config. The OpenAPI JSON format is available from ``/api/sales/v1-json``, for example http://localhost:3000/api/v1-json

## Security

Changing the env value of `APP_MODE` to `secure` (instead of `simple`) does enable more security enhancements, at `Middleware` and `Guard` levels.

1. `ApiKeyGuard`, check for the submitted API Key against the database.
2. `TimestampMiddleware`, enable a tolerance of 2 minutes against requests' provided time stamp (for the API Key based authentication protocol).
3. `CorsMiddleware`, validate requests against the CORS security settings.
4. `UserAgentMiddleware`, enable white-listing requests' user agents.


## Dev Instructions

### Init your dev environment

0. Set up your ``.env`` file, e.g. from ``.env.sample``, especially your MongoDB connection info
   
1. Install your npm packages (if not already done from parent root dir ``lerna bootstrap`` )
```
yarn
```

2. If you want to run a local MongoDB instance you can launch a docker compose container
```
docker compose up mongodb 
```

3. First time only: seed your Mongo DB with an admin user, role & permissions and an authentication API key with ``yarn migrate``
You can roll that back with the command ``yarn rollback``

### Build

Optional standalone build (towards ``./dist``)
```
yarn build
```

### Run

Start your local NestJS server:
```
yarn start
```

With auto-reload on code changes:
```
yarn start:dev
```

Production mode (nodejs):
```
yarn start:prod
```

### Test

Run tests (requires a running MongoDB):
```
yarn test
```

Run integration tests (requires a running MongoDB and a valid AWS account):
```
yarn test:integration
```

Run end-to-end tests (requires a running MongoDB):
```
yarn test:e2e
```

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
[sopenapi-endpoint]: /endpoints/endpoints-account.json

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
