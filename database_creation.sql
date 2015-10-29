BEGIN;

CREATE USER friending_library_user PASSWORD 'test';
CREATE DATABASE friending_library
  OWNER friending_library_user
  TEMPLATE template0;

COMMIT;
