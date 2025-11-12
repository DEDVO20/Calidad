require("dotenv").config();
require("ts-node").register({ transpileOnly: true });

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "admin123",
    database: process.env.DB_NAME || "calidad",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: true,
  },
  cloud: {
    use_env_variable: "DATABASE_URL_CLOUD",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: true,
  },
  production: {
    use_env_variable: "DATABASE_URL_CLOUD",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};
