# capgemini-assignment
Rest API Backend for Capgemini assignment

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

Endpoints (high level)
- `POST /api/auth/register` — register a user
- `POST /api/auth/login` — login (returns JWT)
- `GET /api/auth/profile` — get current user profile (authenticated)
- `GET/POST/PUT/DELETE /api/projects` — project CRUD (authenticated)
- `GET/POST/PUT/DELETE /api/tasks` — task CRUD (authenticated)

Use the `Authorization: Bearer <token>` header for protected endpoints.

## Running tests

Unit and integration tests are written with Jest and Supertest. To run tests:

```bash
npm test
```

Tests run with `NODE_ENV=test` so the code avoids trying to connect to the real DB during unit tests.

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

Notes:
- The chart is minimal; update `values.yaml` to set a container registry, resource requests/limits, and any ingress rules required by your cluster.
- Store `JWT_SECRET` and DB passwords in a secret manager or Kubernetes `Secret` rather than committing them.

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

## Notes & troubleshooting

- If you see database connection errors during development, confirm MySQL credentials and that the DB server allows connections from your host.
- If running inside Docker, ensure the DB host is reachable from the container (use service name for docker-compose networking).
- Keep `JWT_SECRET` and other secrets out of source control — use `.env.local` or your environment/secret manager.

## Next steps & suggestions

- Add migrations with a tool like `knex` or `db-migrate` for incremental migrations.
- Add CI (GitHub Actions) to run tests and build/publish Docker images.
- Add more integration tests (projects/tasks flows) and e2e tests if needed.

---

If you'd like, I can add a `README` section with example curl commands for each endpoint, or scaffold a GitHub Actions workflow to run tests and build images on push.

