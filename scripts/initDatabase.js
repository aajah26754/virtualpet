const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
  const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'data', 'database.sqlite');
  const dir = path.dirname(dbFile);
  fs.mkdirSync(dir, { recursive: true });
  const db = await open({ filename: dbFile, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      passwordHash TEXT,
      formbarId TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS adopt (
	    "id"	INTEGER NOT NULL UNIQUE,
	    "userId"	INTEGER NOT NULL,
	    "petname"	TEXT NOT NULL,
	    PRIMARY KEY("id" AUTOINCREMENT),
	    FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE SET NULL
    );

  `);
  console.log('Database initialized at', dbFile);
  await db.close();
})();
