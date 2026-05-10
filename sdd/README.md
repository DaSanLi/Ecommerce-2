Spec-Driven Development bootstrap for this repository

- Detected stack and conventions have been bootstrapped under the sdd/ folder:
  - sdd/config.yaml describes the frontend/backend stack and API style
  - sdd/persistence/bootstrap.js provides a JSON-file persistence bootstrapper
  - sdd/persistence/storage.json is the initial storage skeleton
  - sdd/specs/ directory skeleton is provided for delta specs

- How to bootstrap manually:
  - Run: node sdd/persistence/bootstrap.js

- Conventions:
  - Delta specs should live under sdd/specs
  - Persistence backed by a simple JSON file at sdd/persistence/storage.json
