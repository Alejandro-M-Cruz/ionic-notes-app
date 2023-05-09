CREATE TABLE IF NOT EXISTS notes (
  localId INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT UNIQUE,
  title TEXT NOT NULL CHECK (length(title) > 0 AND length(title) < 1000),
  content TEXT CHECK (length(content) > 0 AND length(content) < 100000),
  creationTimestamp INTEGER NOT NULL DEFAULT UNIXEPOCH('now'),
  isFavourite BOOLEAN NOT NULL DEFAULT 0
);
