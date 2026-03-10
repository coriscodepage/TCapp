import postgres from 'postgres'

const sql = postgres({
  host                 : process.env.DB_HOST,
  port                 : process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  database             : process.env.DB_DATA,
  username             : process.env.DB_USER,
  password             : process.env.DB_PASS,
  ssl                  : "require",
})
export default sql