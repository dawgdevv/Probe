# Probe — Feature Tracker

Comprehensive list of implemented and planned features.

---

## CLI — Core

| Feature | Status | Notes |
|---|:---:|---|
| YAML-based test definitions | ✅ Done | `tests.yaml` format |
| `run` command | ✅ Done | `probe run <file>` |
| `serve` command | ✅ Done | `probe serve [-p port]` |
| Environment variable substitution (`{{var}}`) | ✅ Done | In paths, headers, body |
| Parallel test execution | ✅ Done | Configurable concurrency (default 10) |
| Semaphore-based concurrency control | ✅ Done | Prevents resource exhaustion |
| CI-friendly exit codes | ✅ Done | Exit 1 on any failure |
| Console formatter (✔/✖ output) | ✅ Done | Real-time progress |
| JSON output formatter | ✅ Done | Structured results |
| Custom data directory (`--data-dir`) | ✅ Done | Default `~/.probe` |
| Custom port (`--port`) | ✅ Done | Default 8443 |
| HTTPS with auto-generated self-signed cert | ❌ Planned | Optional `--tls` flag |
| Graceful server shutdown | ✅ Done | SIGINT/SIGTERM handling |
| Color-coded terminal reports | ❌ Planned | — |
| `--format` flag (json, table, minimal) | ❌ Planned | — |
| `--timeout` flag (per-test) | ❌ Planned | Currently hardcoded 10s |
| `--verbose` flag | ❌ Planned | — |
| `--filter` flag (run specific tests by name) | ❌ Planned | — |
| `init` command (scaffold `tests.yaml`) | ❌ Planned | — |
| `validate` command (lint YAML) | ❌ Planned | — |
| Config file support (`.proberc`) | ❌ Planned | — |

---

## HTTP & Requests

| Feature | Status | Notes |
|---|:---:|---|
| GET requests | ✅ Done | — |
| POST requests | ✅ Done | — |
| PUT requests | ✅ Done | — |
| DELETE requests | ✅ Done | — |
| Custom headers | ✅ Done | Per-test `headers` map |
| JSON request body | ✅ Done | `body` map in YAML |
| Request duration tracking | ✅ Done | Nanosecond precision |
| 10-second request timeout | ✅ Done | Hardcoded |
| PATCH requests | ❌ Planned | — |
| HEAD / OPTIONS requests | ❌ Planned | — |
| Query parameters (`params` field) | ❌ Planned | — |
| Form data / multipart upload | ❌ Planned | — |
| File upload support | ❌ Planned | — |
| Cookie handling | ❌ Planned | — |
| Follow/no-follow redirects | ❌ Planned | — |
| Proxy support | ❌ Planned | — |
| mTLS / client certificates | ❌ Planned | — |

---

## Assertions

| Feature | Status | Notes |
|---|:---:|---|
| Status code assertion | ✅ Done | `expect.status: 200` |
| JSON field exact match | ✅ Done | `expect.json.field: value` |
| Nested field access (dot notation) | ✅ Done | `"user.name": "John"` |
| Array length check (`$.length`) | ✅ Done | `"$.length": ">5"` |
| Numeric comparisons (`>`, `<`) | ✅ Done | On response fields |
| Response body contains string | ❌ Planned | — |
| Regex matching | ❌ Planned | — |
| Header assertions | ❌ Planned | — |
| Response time assertions | ❌ Planned | `expect.maxDuration: 500ms` |
| Schema validation (JSON Schema) | ❌ Planned | — |
| Null / not-null checks | ❌ Planned | — |
| Array element assertions | ❌ Planned | — |

---

## Authentication

| Feature | Status | Notes |
|---|:---:|---|
| Bearer token via headers | ✅ Done | Manual `Authorization` header |
| Auth presets (bearer, basic, api-key) | ❌ Planned | `auth:` block in YAML |
| OAuth2 flow | ❌ Planned | — |
| Environment-based secrets | ❌ Planned | Read from OS env vars |

---

## Web UI (Probe Dashboard)

| Feature | Status | Notes |
|---|:---:|---|
| Embedded SPA (go:embed) | ✅ Done | Zero external dependencies |
| Project management (CRUD) | ✅ Done | Create, list, view |
| Test suite management | ✅ Done | Create with YAML editor |
| Execute suites from browser | ✅ Done | Real-time results |
| Run history per suite | ✅ Done | Click to view details |
| Individual run detail view | ✅ Done | Table with pass/fail/duration |
| Status badges (passed/failed) | ✅ Done | Color-coded |
| SPA routing with fallback | ✅ Done | React Router |
| Breadcrumb navigation | ✅ Done | — |
| Responsive layout | ✅ Done | Tailwind CSS |
| Toast notifications | ✅ Done | react-hot-toast |
| Custom favicon (Probe SVG) | ✅ Done | Branded |
| Dark monochrome theme | ✅ Done | Black & white, production-grade |
| Edit test suites | ❌ Planned | — |
| Delete projects / suites / runs | ❌ Planned | — |
| YAML syntax highlighting | ❌ Planned | CodeMirror/Monaco |
| Search / filter projects | ❌ Planned | — |
| Export run results (CSV, JSON) | ❌ Planned | — |
| Diff view between runs | ❌ Planned | — |
| Real-time streaming results | ❌ Planned | WebSocket / SSE |
| Dashboard stats (charts, trends) | ❌ Planned | — |
| Light theme / theme toggle | ❌ Planned | — |
| Keyboard shortcuts | ❌ Planned | — |

---

## Storage & Data

| Feature | Status | Notes |
|---|:---:|---|
| SQLite database | ✅ Done | Via `modernc.org/sqlite` (pure Go) |
| WAL mode | ✅ Done | Better concurrency |
| Foreign key enforcement | ✅ Done | — |
| Auto-migrations | ✅ Done | Schema versioning |
| Projects table | ✅ Done | — |
| Test suites table | ✅ Done | — |
| Test runs table | ✅ Done | — |
| Test results table | ✅ Done | — |
| Data export / backup | ❌ Planned | — |
| PostgreSQL / MySQL support | ❌ Planned | — |
| Data retention policies | ❌ Planned | — |

---

## REST API

| Feature | Status | Notes |
|---|:---:|---|
| Health check endpoint | ✅ Done | `GET /api/health` |
| Projects CRUD | ✅ Done | List, create, get |
| Suites CRUD | ✅ Done | Create, get |
| Run suite | ✅ Done | `POST /api/suites/:id/run` |
| Run history | ✅ Done | Per suite |
| Run details + results | ✅ Done | — |
| CORS middleware | ✅ Done | Localhost origins |
| Update project | ❌ Planned | `PUT /api/projects/:id` |
| Delete project | ❌ Planned | — |
| Update suite | ❌ Planned | — |
| Delete suite | ❌ Planned | — |
| Delete run | ❌ Planned | — |
| Pagination | ❌ Planned | — |
| API key authentication | ❌ Planned | — |
| Rate limiting | ❌ Planned | — |
| OpenAPI / Swagger docs | ❌ Planned | — |

---

## CI/CD & DevOps

| Feature | Status | Notes |
|---|:---:|---|
| CI-friendly exit codes | ✅ Done | 0 = pass, 1 = fail |
| Single binary distribution | ✅ Done | `go build` |
| Makefile build system | ✅ Done | `make build-all` |
| GitHub Actions workflow | ❌ Planned | — |
| Docker image | ❌ Planned | — |
| Homebrew formula | ❌ Planned | — |
| Pre-built binaries (goreleaser) | ❌ Planned | — |
| JUnit XML report output | ❌ Planned | — |
| Slack / webhook notifications | ❌ Planned | — |

---

## Advanced (Future)

| Feature | Status | Notes |
|---|:---:|---|
| Test dependencies / chaining | ❌ Planned | Run B after A passes |
| Response data extraction | ❌ Planned | Save fields for later tests |
| Test groups / tags | ❌ Planned | `tags: [smoke, regression]` |
| Retry with backoff | ❌ Planned | Per-test retry config |
| Request/response logging | ❌ Planned | Debug mode |
| Mock server | ❌ Planned | Built-in stub server |
| Load testing mode | ❌ Planned | Repeat N times, measure p99 |
| Plugin system | ❌ Planned | Custom assertions / hooks |
| Import from Postman/Insomnia | ❌ Planned | Collection converter |
| Multi-environment configs | ❌ Planned | `--env staging` |
| Watch mode | ❌ Planned | Re-run on file change |
| Snapshot testing | ❌ Planned | Assert full response body |

---

## Summary

| Category | Done | Planned | Total |
|---|:---:|:---:|:---:|
| CLI Core | 13 | 7 | 20 |
| HTTP & Requests | 7 | 9 | 16 |
| Assertions | 5 | 7 | 12 |
| Authentication | 1 | 3 | 4 |
| Web UI | 13 | 9 | 22 |
| Storage & Data | 8 | 3 | 11 |
| REST API | 7 | 8 | 15 |
| CI/CD & DevOps | 3 | 6 | 9 |
| Advanced | 0 | 12 | 12 |
| **Total** | **57** | **64** | **121** |
