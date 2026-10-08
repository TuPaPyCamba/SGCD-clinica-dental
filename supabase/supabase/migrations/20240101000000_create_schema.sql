-- SGCD - Create clinica schema
CREATE SCHEMA IF NOT EXISTS clinica;
GRANT USAGE ON SCHEMA clinica TO authenticated;
GRANT USAGE ON SCHEMA clinica TO service_role;
GRANT USAGE ON SCHEMA clinica TO anon;
ALTER DATABASE postgres SET search_path TO clinica, extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "btree_gist" WITH SCHEMA extensions;
