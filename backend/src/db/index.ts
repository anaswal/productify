import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import * as schema from "./schema";
import {ENV} from "../config/env";

if (!ENV.DB_URL) {
    throw new Error("Missing DB_URL");
}

const pool = new Pool({
    connectionString: ENV.DB_URL,
});

pool.on("connect", () => {
    console.log("Database connected");
})

pool.on("error", (err) => {
    console.error("Database connection error", err);
});

export const db = drizzle({client: pool, schema});
