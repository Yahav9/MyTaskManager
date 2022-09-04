import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool: any = new Pool({
    connectionString:
        process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// connecting to postgres
pool.connect()
    .then(() => console.log('connected to DB'))
    .catch((err: Error) => console.log("can't connect to DB: ", err));

// get a particular user name
export async function getUserName(name: string) {
    const queryText = `SELECT name FROM users WHERE name=$1`;
    return await pool.query(queryText, [name])
        .then((res: any) => res.rows)
        .catch((e: Error) => console.error(e))
}

export async function createUser(name: string) {
    const queryText = `INSERT INTO users (name) VALUES ($1)`;
    return await pool.query(queryText, [name])
        .catch((e: Error) => console.error(e))
}