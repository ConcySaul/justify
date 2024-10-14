import { pool } from "../config/database"

export const saveWordsUsed = async (userId: number, wordsNumber: number): Promise<void> => {
    await pool.query(`
            INSERT INTO words (user_id, words_used)
            VALUES ($1, $2)
        `, [userId, wordsNumber]);
}

export const getWordsNumber = async (userId: number): Promise<number> => {
    const today = new Date;
    const stringToday = today.toISOString().split(('T'))[0];

    const wordsUsed = await pool.query(`
        SELECT COALESCE(SUM(words_used), 0) AS total_words 
        FROM words 
        WHERE user_id = $1 AND DATE(created_at) = $2
        `, [userId, stringToday]);

        return wordsUsed.rows.length > 0 ? Number(wordsUsed.rows[0].total_words) : 0;
    }