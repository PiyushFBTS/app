import pool from "@/lib/db";

export async function getUserbyId(id: string) {
    const result = await pool.query(`SELECT * FROM "OOMiddleware"."users" WHERE user_code = $1`, [id]);
    return result.rows[0] || null;
}

