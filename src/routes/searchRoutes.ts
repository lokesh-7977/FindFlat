import { Hono } from "hono";
import { searchHandler } from "../controllers/searchController";

export const searchRoutes = new Hono();

searchRoutes.get("/", searchHandler);
