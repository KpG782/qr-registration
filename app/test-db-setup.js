// Quick test script to verify database setup
const Database = require('better-sqlite3');
const path = require('path');
const { randomUUID } = require('crypto');

const DB_PATH = path.join(__dirname, 'data', 'events.db');

console.log('🧪 Testing Database Setup...\n');

try {
  // Initialize database
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      date INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

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

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_categories_event_id ON categories(event_id);
    CREATE INDEX IF NOT EXISTS idx_participants_category_id ON participants(category_id);
    CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
  `);

  console.log('✅ Database file created at:', DB_PATH);
  console.log('✅ All tables created successfully');
  console.log('✅ All indexes created successfully');
  console.log('✅ Foreign keys enabled');
  
  // Test insert
  const testId = randomUUID();
  db.prepare('INSERT INTO events (id, name, description) VALUES (?, ?, ?)').run(
    testId,
    'Test Event',
    'This is a test event'
  );
  
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(testId);
  console.log('✅ Test insert successful:', event.name);
  
  // Clean up test data
  db.prepare('DELETE FROM events WHERE id = ?').run(testId);
  console.log('✅ Test cleanup successful');
  
  db.close();
  
  console.log('\n🎉 Database setup is complete and working!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000');
  console.log('3. You should be redirected to /dashboard');
  console.log('4. Click "Events" in the sidebar');
  console.log('5. Click "Create Event" to test the flow');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
