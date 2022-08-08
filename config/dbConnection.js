
const { Pool } = require('pg');
require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
// const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const connectionString = `postgres://kygjkgnu:NTiAe1hqeORR6XQap0xkJ7V6HJHx1E5F@otto.db.elephantsql.com/kygjkgnu`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    // clientURL: isProduction ? process.env.CLIENT_URL : 'http://localhost:9000'
})

pool.connect(err => {
    if (err) throw err;
    console.log("Connected to " , process.env.PG_DATABASE + "...");
  });

module.exports = { pool };