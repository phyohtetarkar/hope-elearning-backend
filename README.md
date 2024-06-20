# E-learning backend

E-learning backend application project developed with [NestJS](https://github.com/nestjs/nest).

## Requirements
<ol>
	<li>Node.js 16 or later</li>
	<li>PostgreSQL 16 or later</li>
	<li>Firebase auth setup</li>
</ol>

## Installation and setup

Required `.env.local` file properties.

```ini
# database config
DB_NAME=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=

FIREBASE_SERVICE_ACCOUNT=/path/to/firebase-serviceaccount.json

JWK_SET_URI=https://www.googleapis.com/service_accounts/v1/jwk/securetoken%40system.gserviceaccount.com
ISSUER_URI=https://securetoken.google.com/<your-project-id>

# for storing uploaded image (e.g, /var/www/html/images)
IMAGE_PATH=<image-base-path> 

IMAGE_URL=(http|https)://<your-domain>/images
```

Installing dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
