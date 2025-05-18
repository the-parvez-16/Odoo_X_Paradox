-- backend/db.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  is_banned BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  datetime TIMESTAMP,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE attendees (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  num_guests INTEGER
);