## Backend HTTP server

Much of the structure of this project is inspired by [this set of recommendations](https://github.com/zhanymkanov/fastapi-best-practices) on structuring a backend project, despite this project not using FastAPI.

- Do not access environment variables by calling `process.env.`. Put the variable into the `config` object in `src/config.ts`, and import the appropriate variable.
- Import with path aliases instead of relative imports.
