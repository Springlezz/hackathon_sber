import { dbGet } from '../db.js';

export async function get(db, { userId, search }) {
    const check = checkProps(['id'], search);
    if (check) return [400, { error: check }];

    const [event] = await dbGet(db, 'SELECT title, description, time, location from events WHERE id = ?', search.id);
    if (!event) return [404, { error: 'Событие не найдено.' }];
    return [200, {
        ...event,
        joined: userId ? !!(await dbGet(db, 'SELECT id FROM event_users WHERE user_id = ? AND event_id = ?', userId, search.id))[0] !== undefined : undefined,
        tags: (await dbGet(db, 'SELECT tag_id FROM event_tags WHERE event_id = ?', search.id)).map(tag => tag.tag_id)
    }];
}