import { randomBytes } from 'crypto';
import { dbGet, dbRun } from './db.js';

export async function createSession(db, userId) {
    const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // 1 week
    const token = randomBytes(16).toString('hex');
    await dbRun(db, 'INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)', token, userId, expires);
    return [token, new Date(expires).toUTCString()];
}
export async function deleteSession(db, token) {
    await dbRun(db, 'DELETE FROM sessions WHERE token = ?', token);
}
export async function getSession(db, token) {
    const [session] = await dbGet(db, 'SELECT user_id, expires FROM sessions WHERE token = ?', token);
    if (!session) return null;
    if (session.expires < Date.now()) {
        await deleteSession(db, token);
        return null;
    }
    return session.user_id;
}