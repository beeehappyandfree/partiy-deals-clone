// import { env } from "@/data/env/server";
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schema";

// const sql = neon(env.DATABASE_URL);
// export const db = drizzle(sql , {schema});

import { env } from "@/data/env/server";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = env.DATABASE_URL || ''
const client = postgres(connectionString)
export const db = drizzle(client, { schema });

