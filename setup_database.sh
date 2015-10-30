#!/bin/bash

# This script creates all the tables for the database.
#
# It assumes a running Postgres server, the client CLI psql available from the
# current directory, and the existence of the database "friending_library" with
# owner "friending_library_user" (created with the create_database.sh script).

psql -d friending_library -U friending_library_user -f database_setup.sql
