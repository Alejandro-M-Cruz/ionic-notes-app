CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  creation_timestamp DATETIME NOT NULL,
  last_update_timestamp DATETIME NOT NULL,
  local_storage_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);
