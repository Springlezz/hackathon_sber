import { dbGet } from '../db.js';

export async function get(db, { userId }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];

    const events = await dbGet(db, 'SELECT * FROM events');
    return [200, { events }];
}