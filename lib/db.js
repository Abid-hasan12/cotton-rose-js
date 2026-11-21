import mysql from "mysql2/promise";

let pool;

function getPool() {
  if (!pool) {
    const required = ["DB_HOST", "DB_USER", "DB_NAME"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length || !process.env.DB_PASSWORD) {
      throw new Error(`Missing database configuration: ${[...missing, ...(!process.env.DB_PASSWORD ? ["DB_PASSWORD"] : [])].join(", ")}`);
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

export async function query(sql, values = []) {
  const [results] = await getPool().execute(sql, values);
  return results;
}
