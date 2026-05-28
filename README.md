# capgemini-assignment
This repository contains a production-ready Node.js + Express REST API for managing projects and tasks with JWT authentication, input validation, structured logging and tests. The project uses MySQL as the datastore.

## Prerequisites
- Node.js (>=18)
- npm
- MySQL server (or use Docker)
- Docker & docker-compose (optional, for containerized local dev)
- kubectl + Helm (optional, for Kubernetes deployment)

## Quick start — local (development)

1. Clone the repo and install dependencies

```bash
git clone <this-repo-url>
cd capgemini-assignment
npm install
```

2. Copy the environment file and update values

```bash
cp .env .env.local
# Edit .env.local and set DB credentials and JWT_SECRET
```

Minimum required env vars (see `.env`):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `PORT` (defaults to 3000)

Optional SSL env vars:
- `SSL_KEY_PATH` — path to the private key file
- `SSL_CERT_PATH` — path to the certificate file
- `SSL_PASSPHRASE` — optional passphrase for the private key

3. Create the database and run migrations

```bash
# Ensure MySQL is running and reachable with the credentials in your .env.local
npm run migrate
```

4. Start the server

```bash
npm run dev
# or
npm start
```

The API will be available at `http://localhost:3000` (or the port configured in `.env`).
If `SSL_KEY_PATH` and `SSL_CERT_PATH` are configured, the app will start an HTTPS server at `https://localhost:3000`.

Endpoints (high level)
- `POST /api/auth/register` — register a user
- `POST /api/auth/login` — login (returns JWT)
- `GET /api/auth/profile` — get current user profile (authenticated)
- `GET/POST/PUT/DELETE /api/projects` — project CRUD (authenticated)
- `GET/POST/PUT/DELETE /api/tasks` — task CRUD (authenticated)

Use the `Authorization: Bearer <token>` header for protected endpoints.

API documentation is available at `http://localhost:3000/api/docs` after starting the server.

## Running tests

Unit and integration tests are written with Jest and Supertest. To run tests:

```bash
npm test
```

Tests run with `NODE_ENV=test` so the code avoids trying to connect to the real DB during unit tests.

## SSL support

The application can run in HTTPS mode when the following environment variables are set:

- `SSL_KEY_PATH` — path to the private key file
- `SSL_CERT_PATH` — path to the certificate file
- `SSL_PASSPHRASE` — optional passphrase for the private key

Create a self-signed certificate for local development:

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:4096 -nodes -keyout certs/key.pem -out certs/cert.pem -days 365 \
  -subj "/C=US/ST=State/L=City/O=Org/CN=localhost"
```

Then update `.env` or `.env.local` and start the server as normal.

When SSL is configured, use `https://localhost:3000`.

## Docker (local)

Build image and run container:

```bash
docker build -t capgemini-assignment:latest .
docker run --env-file .env -p 3000:3000 capgemini-assignment:latest
```

Alternatively use docker-compose:

```bash
docker-compose up --build
```

If HTTPS is enabled, make sure the `certs` directory exists in the project root so the container can access `./certs/key.pem` and `./certs/cert.pem`.

## Kubernetes & Helm (deployment)

There are simple k8s manifests in `k8s/` and a Helm chart scaffold in `charts/capgemini-assignment`.

Apply manifests manually (update secrets/config first):

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Install via Helm (defaults from `charts/capgemini-assignment/values.yaml`):

```bash
helm install my-capgemini charts/capgemini-assignment
```


## Database schema & migrations

Schema is in `database/schema.sql` and a migration runner is at `database/migrate.js`. The migration script will create the database (if missing) and run the schema statements.

## Trade-offs

- `mysql2` with raw SQL was chosen for simplicity and direct control over queries, but it requires more manual query handling than an ORM or query builder.
- JWT provides a stateless authentication model that is easier to scale, while the trade-off is that token revocation and session invalidation require additional infrastructure.
- The service/repository separation keeps business logic testable and easier to mock, but it also adds application boilerplate compared to a smaller controller-centric design.
- The current test suite relies on mocked persistence for fast unit feedback; end-to-end or integration tests are still valuable to validate the real database and schema behavior.
- For caching and scaling, using Redis would be a natural next step for session storage, rate-limit state, or frequently-read project/task metadata, but it adds operational complexity and another service dependency.
- Security posture should include secure cookie/JWT handling, environment-based secret management, and database credentials stored outside source control. Scaling the API also benefits from horizontal stateless app instances behind a load balancer with shared cache or session state.

## Logging

Winston is configured at `src/utils/logger.js`. Logs are written to console and to the file configured by `LOG_FILE` in the `.env`.


