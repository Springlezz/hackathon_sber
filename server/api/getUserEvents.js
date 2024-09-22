import { dbAll } from '../db.js';

export async function get(db, { userId }) {
    if (userId === null) return [401, { error: 'Пользователь не авторизован.' }];

    const sql = `
        SELECT events.id, events.title, events.description, events.time, events.duration, events.location FROM events
        JOIN event_users ON event_users.event_id = events.id
        WHERE event_users.user_id = ?
    `;

    const [events] = await dbAll(db, sql, userId);
    return [200, { events }];
}