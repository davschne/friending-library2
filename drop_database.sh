#!/bin/bash

# This script drops the database "friending_library" and the user
# "friending_library_user."
#
# It assumes a running Postgres server, the client CLI psql available from the
# current directory, and a Postgres user/role with CREATEDB authorization.

psql -d template1 -f sql/database_drop.sql
