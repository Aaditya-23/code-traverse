import { migrate } from 'drizzle-orm/vercel-postgres/migrator'
import { db } from './drizzle.server'

migrate(db, { migrationsFolder: 'drizzle' })
