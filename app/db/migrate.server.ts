import { migrate } from 'drizzle-orm/vercel-postgres/migrator'
import { db } from './drizzle.server'
import 'dotenv/config'

export async function runMigrations() {
  await migrate(db, { migrationsFolder: 'drizzle' })
}

runMigrations()
  .then((_) => {
    console.log('ran migrations successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.log('error in running migrations', error)
    process.exit(1)
  })
