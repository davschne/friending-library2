#!/bin/bash

# This script creates a database user "friending_library_user" and a database,
# "friending_library".
#
# It assumes a running Postgres server, the client CLI psql available from the
# current directory, and a Postgres user/role with CREATEDB authorization.

psql -d template1 -f db/database_creation.sql
