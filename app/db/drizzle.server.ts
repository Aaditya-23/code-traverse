import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema.server'

export const db = drizzle(sql, { schema })
