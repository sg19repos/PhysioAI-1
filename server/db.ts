import dotenv from 'dotenv';
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = 'your_database_url_here';

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set. Did you forget to provision a database?',
  );
}

// Fallback: Use in-memory mock DB if DATABASE_URL is not set or invalid
let db: any;
let pool: any;

if (DATABASE_URL && DATABASE_URL !== 'your_database_url_here') {
  pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  // Simple in-memory mock implementation
  db = {
    data: {},
    get(table: string, id: string) {
      return this.data[table]?.[id] || null;
    },
    set(table: string, id: string, value: any) {
      if (!this.data[table]) this.data[table] = {};
      this.data[table][id] = value;
    },
    all(table: string) {
      return Object.values(this.data[table] || {});
    },
  };
  pool = null;
  console.warn('Using in-memory DB. Data will not persist between restarts.');
}

export { db, pool };
