module.exports = {
  "app-url" : process.env.APP_URL || "http://localhost:3000",
  "redis": {
    "test": {
      "URI": process.env.REDIS_TEST_URI
      || "redis://:authpassword@127.0.0.1:6379/1"
    },
    "prod": {
      "URI": process.env.REDIS_PROD_URI
      || "redis://:authpassword@127.0.0.1:6379/0"
    }
  },
  "pg": {
    "test": {
      "host"    : process.env.PG_TEST_HOST || "127.0.0.1",
      "port"    : process.env.PG_TEST_PORT || 5432,
      "user"    : process.env.PG_TEST_USER || "friending_library_test_user",
      "password": process.env.PG_TEST_PW   || "test",
      "database": process.env.PG_TEST_DB   || "friending_library_test",
    },
    "prod": {
      "host"    : process.env.PG_PROD_HOST || "127.0.0.1",
      "port"    : process.env.PG_PROD_PORT || 5432,
      "user"    : process.env.PG_PROD_USER || "friending_library_user",
      "password": process.env.PG_PROD_PW   || "readmorebooks",
      "database": process.env.PG_PROD_DB   || "friending_library",
    },
    "admin": {
      "host"    : process.env.PG_ADMIN_HOST || "127.0.0.1",
      "port"    : process.env.PG_ADMIN_PORT || 5432,
      "user"    : process.env.PG_ADMIN_USER || "postgres",
      "password": process.env.PG_ADMIN_PW   || "postgres",
      "database": process.env.PG_ADMIN_DB   || "template1",
    },
    "template": process.env.PG_TEMPLATE || "template1"
  },
  "facebook": {
    "id"     : process.env.FB_ID,
    "secret" : process.env.FB_SECRET
  }
}
