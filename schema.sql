-- ============================================================
-- SCHEMA: Auditoria eLearning Platform
-- Universidad Mariano Gálvez
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role        VARCHAR(50) DEFAULT 'student',  -- 'student' | 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_completions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_slug  VARCHAR(255) NOT NULL,
  score        INTEGER NOT NULL DEFAULT 0,
  max_score    INTEGER NOT NULL DEFAULT 30,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_slug)
);

CREATE TABLE IF NOT EXISTS course_completions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_score  INTEGER NOT NULL,
  max_score    INTEGER NOT NULL DEFAULT 210,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed an admin user (password: admin123 — change in production)
-- bcrypt hash for "admin123"
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Administrador',
  'admin@auditoria.edu.gt',
  '$2b$10$rOzJqzJqzJqzJqzJqzJqzOJqzJqzJqzJqzJqzJqzJqzJqzJqzJqz',
  'admin'
) ON CONFLICT DO NOTHING;
