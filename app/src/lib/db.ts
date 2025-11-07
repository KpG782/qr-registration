import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';

// Database file path
const DB_PATH = path.join(process.cwd(), 'data', 'events.db');

// Initialize database connection
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

// Initialize database schema
function initializeSchema() {
  if (!db) return;

  // Create events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      date INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);

  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  // Create participants table
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      school_institution TEXT,
      attendance_status TEXT DEFAULT 'pending' CHECK(attendance_status IN ('pending', 'checked_in')),
      checked_in_at INTEGER,
      winner_rank INTEGER CHECK(winner_rank IN (1, 2, 3)),
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE(category_id, email)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_categories_event_id ON categories(event_id);
    CREATE INDEX IF NOT EXISTS idx_participants_category_id ON participants(category_id);
    CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
  `);
}

// Helper function to generate UUID
export function generateId(): string {
  return randomUUID();
}

// Close database connection
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

// Export database instance getter
export default getDb;
