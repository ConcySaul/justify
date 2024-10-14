import { pool } from "../config/database";
import { User } from "./user-type";

export const saveUser = async (email: string): Promise<User> => {
     const result = await pool.query(`
        INSERT INTO users (email)
        VALUES ($1)
        RETURNING *;
    `, [email]);
    return result.rows[0];
}

export const getUserByEmail = async (email: string): Promise<User> => {
    const result = await pool.query(`
            SELECT *
            FROM users
            WHERE email = $1 
        `, [email]);
    return result.rows[0];
}