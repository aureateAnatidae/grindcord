## Backend HTTP server

Much of the structure of this project is inspired by [this set of recommendations](https://github.com/zhanymkanov/fastapi-best-practices) on structuring a backend project, despite this project not using FastAPI.

- Do not access environment variables by calling `process.env.<VARIABLE NAME>`. Put the variable into the `config` object in `config.ts`, and import the appropriate variable.
    - If the behaviour of Grindcord should depend on an environment variable, then it should be called in  `config.ts`.
- Import with path aliases instead of relative imports.
