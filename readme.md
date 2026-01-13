# API Tester CLI

A command-line tool for testing APIs using YAML configuration files.

## Features

- [x] YAML-based test configuration
- [x] Parallel test execution with concurrency control
- [x] Environment variable substitution
- [x] HTTP method support (GET, POST, PUT, DELETE)
- [x] Status code assertions
- [x] JSON response validation
- [x] JSONPath field access
- [x] Array length validation
- [x] Numeric comparison operators
- [x] Custom request headers
- [x] Request duration tracking
- [x] Color-coded test reports
- [ ] Query parameter support
- [ ] Authentication presets
- [ ] Test dependencies and chaining
- [ ] Response data extraction
- [ ] Test grouping and tagging
- [ ] Retry logic
- [ ] Export reports (JSON, HTML, XML)
- [ ] Mock server integration
- [ ] Request/response logging
- [ ] CI/CD integration helpers

## Installation

```bash
go install github.com/dawgdevv/apitestercli@latest
```

Or clone and build:

```bash
git clone https://github.com/dawgdevv/apitestercli
cd apitestercli
go build
```

## Usage

Create a `tests.yaml` file with your API test definitions, then run:

```bash
apitestercli run
```

## Project Structure

```
Apitestercli/
├── cmd/           # CLI commands
├── internal/      # Internal packages
│   ├── assert/    # JSON assertions
│   ├── config/    # Configuration handling
│   ├── executor/  # Test execution
│   ├── loader/    # Test loading
│   └── report/    # Result reporting
└── pkg/
    └── models/    # Data models
```

## License

MIT
