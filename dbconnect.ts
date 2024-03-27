import mysql from "mysql";
import util from "util"

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "sql6.freesqldatabase.com",
  database: "sql6689430",
  user: "sql6689430",
  password: "cSAzghWNsu",
});

export const queryAsync = util.promisify(conn.query).bind(conn);