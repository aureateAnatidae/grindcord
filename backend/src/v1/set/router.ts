import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { SetRecord, SetReport } from "@v1/set/schemas";


const app = new Hono();

export default app;
