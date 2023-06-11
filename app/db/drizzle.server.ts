import { drizzle } from 'drizzle-orm/vercel-postgres'
import { migrate } from 'drizzle-orm/vercel-postgres/migrator'
import { sql } from '@vercel/postgres'
import * as schema from './schema.server'

export const db = drizzle(sql, { schema })
migrate(db, { migrationsFolder: 'drizzle' })
